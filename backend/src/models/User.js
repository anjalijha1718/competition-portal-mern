import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false, // Don't return by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    referralEarnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate a referral code if not exists
userSchema.pre('save', function (next) {
  if (!this.referralCode && this.name) {
    const cleanName = this.name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    this.referralCode = `${cleanName || 'FEED'}${randomHex}`;
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      name: this.name,
    },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
};

export const User = mongoose.model('User', userSchema);
