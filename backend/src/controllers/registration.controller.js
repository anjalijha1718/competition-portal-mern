import { RegistrationService } from '../services/registration.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class RegistrationController {
  static registerForCompetition = asyncHandler(async (req, res) => {
    const competitionId = req.params.id;
    const userId = req.user._id;
    const idempotencyKey = req.header('Idempotency-Key') || req.header('x-idempotency-key') || null;
    const { amountPaid } = req.body || {};

    const result = await RegistrationService.registerUser({
      competitionId,
      userId,
      idempotencyKey,
      amountPaid,
    });

    if (result.fromCache) {
      res.setHeader('X-Cache-Lookup', 'HIT');
      return res.status(result.statusCode).json({
        success: true,
        message: 'Registration returned from idempotency cache',
        data: result.data,
      });
    }

    return ApiResponse.created(res, result.data, 'Registered successfully for the competition');
  });

  static getMyRegistration = asyncHandler(async (req, res) => {
    const competitionId = req.params.id;
    const userId = req.user._id;

    const data = await RegistrationService.getMyRegistration(competitionId, userId);
    return ApiResponse.success(res, data, 'User registration details fetched successfully');
  });

  static submitEntry = asyncHandler(async (req, res) => {
    const competitionId = req.params.id;
    const userId = req.user._id;
    const { submissionUrl } = req.body;

    const data = await RegistrationService.submitEntry({
      competitionId,
      userId,
      submissionUrl,
    });

    return ApiResponse.success(res, data, 'Competition entry submitted successfully');
  });
}
