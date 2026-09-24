import mongoose from 'mongoose';
import { Competition } from '../models/Competition.js';
import { Registration } from '../models/Registration.js';
import { IdempotencyKey } from '../models/IdempotencyKey.js';
import { ApiError } from '../utils/ApiError.js';
import { computeCompetitionStatus } from '../utils/dateHelpers.js';

export class RegistrationService {
  /**
   * Concurrency-safe registration with atomic slot increment and session transaction
   */
  static async registerUser({ competitionId, userId, idempotencyKey = null, amountPaid = 99 }) {
    // 1. Idempotency Check: if key provided, check if already processed
    if (idempotencyKey) {
      const cached = await IdempotencyKey.findOne({ key: idempotencyKey, userId });
      if (cached) {
        return {
          fromCache: true,
          statusCode: cached.statusCode,
          data: cached.responseBody,
        };
      }
    }

    // 2. Fetch competition and validate existence & lifecycle state
    const comp = await Competition.findById(competitionId);
    if (!comp) {
      throw ApiError.notFound('Competition not found');
    }

    const now = new Date();
    const statusMeta = computeCompetitionStatus(comp.importantDates, comp.bookedSlots, comp.totalSlots, now);

    // Business check: registration allowed?
    if (now > new Date(comp.importantDates.registerBefore)) {
      throw ApiError.badRequest('Registration has closed for this competition');
    }

    // Business check: already registered check (fast path)
    const existingRegistration = await Registration.findOne({ competitionId, userId });
    if (existingRegistration) {
      throw ApiError.conflict('You are already registered for this competition');
    }

    // Check if MongoDB deployment supports multi-document transactions (ReplicaSet or Sharded)
    const topologyType = mongoose.connection?.client?.topology?.description?.type;
    const canUseTransaction = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';

    let session = null;
    let slotIncremented = false;

    if (canUseTransaction) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    try {
      const sessionOption = session ? { session } : {};

      // Step A: Atomically reserve a slot using condition { $expr: { $lt: ["$bookedSlots", "$totalSlots"] } }
      // This is concurrency-safe: MongoDB locks the document during findOneAndUpdate.
      const updatedComp = await Competition.findOneAndUpdate(
        {
          _id: competitionId,
          $expr: { $lt: ['$bookedSlots', '$totalSlots'] },
        },
        {
          $inc: { bookedSlots: 1 },
        },
        {
          new: true,
          ...sessionOption,
        }
      );

      // If null, either another concurrent request took the last slot or slots are full
      if (!updatedComp) {
        throw ApiError.conflict('No slots available. The competition is already full.');
      }

      slotIncremented = true;

      // Step B: Create the registration document
      const regPayload = {
        competitionId,
        userId,
        status: 'registered',
        paymentStatus: 'paid',
        amountPaid: amountPaid || comp.entryFee,
        registeredAt: now,
      };

      let registration;
      if (session) {
        const createdDocs = await Registration.create([regPayload], sessionOption);
        registration = createdDocs[0];
        await session.commitTransaction();
      } else {
        registration = await Registration.create(regPayload);
      }

      const responseData = {
        registration,
        bookedSlots: updatedComp.bookedSlots,
        totalSlots: updatedComp.totalSlots,
        slotsRemaining: Math.max(0, updatedComp.totalSlots - updatedComp.bookedSlots),
      };

      // 4. Cache response in IdempotencyKey for 24h
      if (idempotencyKey) {
        try {
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          await IdempotencyKey.create({
            key: idempotencyKey,
            userId,
            endpoint: `/api/v1/competitions/${competitionId}/register`,
            statusCode: 201,
            responseBody: responseData,
            expiresAt,
          });
        } catch (cacheErr) {
          console.warn('[Idempotency] Failed to store cache key:', cacheErr.message);
        }
      }

      return {
        fromCache: false,
        statusCode: 201,
        data: responseData,
      };
    } catch (error) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (abortErr) {
          console.error('[Transaction Abort Error]:', abortErr.message);
        }
      } else if (slotIncremented) {
        // Compensating rollback if standalone mongo and error occurred after increment
        try {
          await Competition.findByIdAndUpdate(competitionId, {
            $inc: { bookedSlots: -1 },
          });
        } catch (rollbackErr) {
          console.error('[Compensating Rollback Error]:', rollbackErr.message);
        }
      }

      // Handle duplicate compound key error gracefully
      if (error.code === 11000) {
        throw ApiError.conflict('You are already registered for this competition');
      }

      throw error;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  }

  /**
   * Get registration details for current user and competition
   */
  static async getMyRegistration(competitionId, userId) {
    const registration = await Registration.findOne({ competitionId, userId }).populate('competitionId', 'title slug importantDates');

    if (!registration) {
      throw ApiError.notFound('No registration found for this user in this competition');
    }

    return registration;
  }

  /**
   * Submit entry (video link / submission URL)
   */
  static async submitEntry({ competitionId, userId, submissionUrl }) {
    const comp = await Competition.findById(competitionId);
    if (!comp) {
      throw ApiError.notFound('Competition not found');
    }

    const now = new Date();
    const submissionStart = new Date(comp.importantDates.submissionStart);
    const submissionEnd = new Date(comp.importantDates.submissionEnd);

    if (now < submissionStart) {
      throw ApiError.badRequest(
        `Submission window has not opened yet. Submissions open on ${submissionStart.toLocaleString()}`
      );
    }

    if (now > submissionEnd) {
      throw ApiError.badRequest(
        `Submission deadline has passed. Submissions closed on ${submissionEnd.toLocaleString()}`
      );
    }

    const registration = await Registration.findOne({ competitionId, userId });
    if (!registration) {
      throw ApiError.forbidden('You must register for this competition before submitting your entry');
    }

    registration.submissionUrl = submissionUrl;
    registration.status = 'submitted';
    registration.submittedAt = now;
    await registration.save();

    return registration;
  }
}
