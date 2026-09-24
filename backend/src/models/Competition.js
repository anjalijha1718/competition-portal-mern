import mongoose from 'mongoose';

const previousWinnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  badge: { type: String, default: 'Winner' },
});

const rewardSchema = new mongoose.Schema({
  position: { type: Number, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
});

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  experienceYears: { type: Number, default: 0 },
  photoUrl: { type: String, default: '' },
  introVideoUrl: { type: String, default: '' },
});

const importantDatesSchema = new mongoose.Schema({
  registerBefore: { type: Date, required: true },
  submissionStart: { type: Date, required: true },
  submissionEnd: { type: Date, required: true },
  resultDate: { type: Date, required: true },
});

const referralSchema = new mongoose.Schema({
  baseUrl: { type: String, default: 'https://feedants.com/compete/' },
  rewardPerSignup: { type: Number, default: 10 },
});

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Dance',
    },
    format: {
      type: String,
      default: 'Multi-Win',
    },
    certificateProvided: {
      type: Boolean,
      default: true,
    },
    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedSlots: {
      type: Number,
      default: 0,
      min: 0,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    },
    judge: {
      type: judgeSchema,
      required: true,
    },
    importantDates: {
      type: importantDatesSchema,
      required: true,
    },
    previousWinners: [previousWinnerSchema],
    about: {
      type: String,
      required: true,
    },
    judgingParameters: [{ type: String }],
    rulesAndEligibility: [{ type: String }],
    rewards: [rewardSchema],
    disclaimer: {
      type: String,
      default: 'Feedants reserves the right to cancel or modify any competition in case of irregularities.',
    },
    referral: {
      type: referralSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'registration_closed', 'submission_open', 'completed'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for slots remaining
competitionSchema.virtual('slotsRemaining').get(function () {
  return Math.max(0, this.totalSlots - this.bookedSlots);
});

export const Competition = mongoose.model('Competition', competitionSchema);
