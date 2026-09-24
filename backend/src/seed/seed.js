import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Competition } from '../models/Competition.js';
import { User } from '../models/User.js';
import { Registration } from '../models/Registration.js';
import { IdempotencyKey } from '../models/IdempotencyKey.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Cleaning existing records...');

    await Promise.all([
      Competition.deleteMany({}),
      User.deleteMany({}),
      Registration.deleteMany({}),
      IdempotencyKey.deleteMany({}),
    ]);

    console.log('[Seed] Cleaned old data.');

    // 1. Create demo users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const registeredUser = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@feedants.com',
      passwordHash,
      role: 'user',
      referralCode: 'RAHU8821',
      referralEarnings: 20,
    });

    const demoUser = await User.create({
      name: 'Ananya Sharma',
      email: 'demo@feedants.com',
      passwordHash,
      role: 'user',
      referralCode: 'ANAN4590',
      referralEarnings: 0,
    });

    const adminUser = await User.create({
      name: 'Admin Feedants',
      email: 'admin@feedants.com',
      passwordHash,
      role: 'admin',
      referralCode: 'ADMI9999',
    });

    console.log('[Seed] Created users: rahul@feedants.com, demo@feedants.com, admin@feedants.com');

    // 2. Prepare competition dates
    // For live demo experience, we compute future dates relative to now so the live countdown timer ticks:
    const now = new Date();
    const liveRegisterBefore = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000); // +4 days 12 hours
    const liveSubmissionStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago (submissions open!)
    const liveSubmissionEnd = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // +10 days
    const liveResultDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days

    // Fixed historical dates from the design reference (August 2026):
    const fixedDates = {
      registerBefore: new Date('2026-08-10T23:50:00.000Z'),
      submissionStart: new Date('2026-08-06T04:00:00.000Z'),
      submissionEnd: new Date('2026-08-30T23:55:00.000Z'),
      resultDate: new Date('2026-09-01T23:50:00.000Z'),
    };

    // Shared competition details matching reference design exactly
    const classicalDanceData = {
      title: 'Feedants Classical Dance',
      slug: 'feedants-classical-dance',
      category: 'Dance',
      format: 'Multi-Win',
      certificateProvided: true,
      prizePool: 1500,
      entryFee: 99,
      totalSlots: 20,
      bookedSlots: 1, // Rahul Verma is pre-registered
      bannerUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
      judge: {
        name: 'Manju Dubey',
        title: 'Professional Kathak Dancer',
        experienceYears: 12,
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        introVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // or demo dance video
      },
      importantDates: {
        registerBefore: liveRegisterBefore,
        submissionStart: liveSubmissionStart,
        submissionEnd: liveSubmissionEnd,
        resultDate: liveResultDate,
      },
      previousWinners: [
        {
          name: 'Riya Shah',
          rank: 1,
          badge: '1st',
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        {
          name: 'Aarav Mehta',
          rank: 1,
          badge: '1st',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        },
        {
          name: 'Neha Verma',
          rank: 2,
          badge: '2nd',
          imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        },
        {
          name: 'Ishita Chopra',
          rank: 3,
          badge: '3rd',
          imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        },
      ],
      about:
        'Showcase your classical grace in the premier national classical dance challenge by Feedants! Whether you practice Kathak, Bharatanatyam, Odissi, Kuchipudi, or Kathakali, this platform is tailored to recognize artistic excellence, expressive abhinaya, and technical mastery. Submit your video to be judged by esteemed gurus and win cash prizes plus official verification certificates!',
      judgingParameters: [
        'Rhythm & Tala Sync (Taal Precision)',
        'Bhava & Abhinaya (Facial Expressions & Storytelling)',
        'Footwork & Posture (Angashuddhi & Nritta)',
        'Choreography & Musicality',
        'Costume, Adornment & Overall Stage Presence',
      ],
      rulesAndEligibility: [
        'Open to solo participants of all age groups residing in India.',
        'Dance style must strictly belong to recognized Indian Classical forms.',
        'Video duration should be between 1.5 to 3 minutes.',
        'Performance video must be recorded in single, continuous take without cuts or visual FX.',
        'Proper classical attire (Ghungroos, costume) is mandatory.',
        'High quality audio track or live accompaniment is permitted.',
      ],
      rewards: [
        { position: 1, title: '1st Prize Winner', amount: 550 },
        { position: 2, title: '2nd Prize Winner', amount: 300 },
        { position: 3, title: '3rd Prize Winner', amount: 240 },
        { position: 4, title: '4th Position', amount: 200 },
        { position: 5, title: '5th Position', amount: 130 },
        { position: 6, title: '6th Position', amount: 80 },
      ],
      disclaimer:
        'Feedants reserves the right to verify submissions. Decisions by the judge are final and binding. In case of duplicate entries or copyright infringement, the entry will be disqualified.',
      referral: {
        baseUrl: 'https://feedants.com/compete/',
        rewardPerSignup: 10,
      },
      status: 'published',
    };

    // Create the primary live competition
    const mainCompetition = await Competition.create(classicalDanceData);

    // Also seed a replica with the exact fixed August 2026 dates from prompt for verification
    await Competition.create({
      ...classicalDanceData,
      title: 'Feedants Classical Dance (Design Ref Fixed Dates)',
      slug: 'feedants-classical-dance-fixed-dates',
      importantDates: fixedDates,
    });

    // Also seed a "Slots Full" variant to test the 409 overbooking behavior in UI
    await Competition.create({
      ...classicalDanceData,
      title: 'Feedants Classical Dance (Sold Out Test)',
      slug: 'feedants-classical-dance-sold-out',
      totalSlots: 20,
      bookedSlots: 20,
    });

    // 3. Create the 1 existing registration for Rahul Verma to make bookedSlots: 1 consistent!
    await Registration.create({
      competitionId: mainCompetition._id,
      userId: registeredUser._id,
      status: 'registered',
      paymentStatus: 'paid',
      amountPaid: 99,
      registeredAt: new Date(Date.now() - 3600000), // 1 hour ago
    });

    console.log('[Seed] Main competition created:', mainCompetition.slug);
    console.log('[Seed] Initial registration created for:', registeredUser.email);
    console.log('[Seed] Seeding complete! Database is ready.');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
