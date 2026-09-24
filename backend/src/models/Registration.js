import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['registered', 'submitted', 'cancelled'],
      default: 'registered',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid', // Simulated Razorpay flow sets paid
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentId: {
      type: String,
      default: () => `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    },
    submissionUrl: {
      type: String,
      default: null,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent double registration at database level
registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Registration = mongoose.model('Registration', registrationSchema);
