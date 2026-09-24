import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { name, email, password, referralCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode: referralCode.toUpperCase() });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      referredBy: referredByUser ? referredByUser._id : null,
    });

    if (referredByUser) {
      // Reward referrer ₹10 as per rules
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: { referralEarnings: 10 },
      });
    }

    const token = user.generateAuthToken();

    return ApiResponse.created(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          referralCode: user.referralCode,
        },
      },
      'User registered successfully'
    );
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = user.generateAuthToken();

    return ApiResponse.success(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          referralCode: user.referralCode,
        },
      },
      'Logged in successfully'
    );
  });

  static getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-passwordHash');
    return ApiResponse.success(res, { user }, 'Current user profile');
  });
}
