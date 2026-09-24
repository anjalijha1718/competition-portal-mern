import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class ReferralController {
  static getMyReferral = asyncHandler(async (req, res) => {
    const user = req.user;
    const referralCode = user.referralCode || 'FEEDANTS10';
    const baseUrl = 'https://feedants.com/compete/feedants-classical-dance?ref=';

    return ApiResponse.success(res, {
      code: referralCode,
      url: `${baseUrl}${referralCode}`,
      rewardPerSignup: 10,
      totalEarned: user.referralEarnings || 0,
    }, 'Referral info retrieved successfully');
  });
}
