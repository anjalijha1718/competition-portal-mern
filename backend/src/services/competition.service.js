import { Competition } from '../models/Competition.js';
import { Registration } from '../models/Registration.js';
import { ApiError } from '../utils/ApiError.js';
import { computeCompetitionStatus } from '../utils/dateHelpers.js';

export class CompetitionService {
  /**
   * Get full details of competition by slug, including user participation state
   */
  static async getCompetitionBySlug(slug, userId = null, overrideNow = null) {
    const competition = await Competition.findOne({ slug });

    if (!competition) {
      throw ApiError.notFound(`Competition with slug '${slug}' not found`);
    }

    // Compute live lifecycle state from dates and current bookedSlots
    const statusMeta = computeCompetitionStatus(
      competition.importantDates,
      competition.bookedSlots,
      competition.totalSlots,
      overrideNow
    );

    // Fetch user registration state if logged in
    let userRegistrationState = null;
    if (userId) {
      const reg = await Registration.findOne({
        competitionId: competition._id,
        userId,
      });

      if (reg) {
        userRegistrationState = {
          isRegistered: true,
          status: reg.status,
          paymentStatus: reg.paymentStatus,
          registeredAt: reg.registeredAt,
          submissionUrl: reg.submissionUrl,
          submittedAt: reg.submittedAt,
        };
      } else {
        userRegistrationState = {
          isRegistered: false,
          status: null,
        };
      }
    }

    return {
      competition,
      userRegistrationState,
      liveStatus: statusMeta.liveStatus,
      isRegistrationOpen: statusMeta.isRegistrationOpen,
      isSubmissionOpen: statusMeta.isSubmissionOpen,
      isSlotsFull: statusMeta.isSlotsFull,
      slotsRemaining: Math.max(0, competition.totalSlots - competition.bookedSlots),
      timeRemainingToRegisterMs: statusMeta.timeRemainingToRegisterMs,
      timeRemainingToSubmissionCloseMs: statusMeta.timeRemainingToSubmissionCloseMs,
      currentTimeIso: statusMeta.currentTimeIso,
    };
  }

  /**
   * List competitions with pagination and derived status
   */
  static async listCompetitions({ page = 1, limit = 10, category, status } = {}) {
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [competitions, total] = await Promise.all([
      Competition.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Competition.countDocuments(query),
    ]);

    const formatted = competitions.map((comp) => {
      const statusMeta = computeCompetitionStatus(
        comp.importantDates,
        comp.bookedSlots,
        comp.totalSlots
      );
      return {
        ...comp.toObject(),
        liveStatus: statusMeta.liveStatus,
        slotsRemaining: Math.max(0, comp.totalSlots - comp.bookedSlots),
        timeRemainingToRegisterMs: statusMeta.timeRemainingToRegisterMs,
      };
    });

    return {
      competitions: formatted,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }
}
