import { CompetitionService } from '../services/competition.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class CompetitionController {
  static getCompetition = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const userId = req.user ? req.user._id : null;
    const overrideNow = req.query.now || null;

    const data = await CompetitionService.getCompetitionBySlug(slug, userId, overrideNow);
    return ApiResponse.success(res, data, 'Competition details fetched successfully');
  });

  static listCompetitions = asyncHandler(async (req, res) => {
    const { page, limit, category, status } = req.query;
    const data = await CompetitionService.listCompetitions({ page, limit, category, status });
    return ApiResponse.success(res, data, 'Competitions list fetched successfully');
  });
}
