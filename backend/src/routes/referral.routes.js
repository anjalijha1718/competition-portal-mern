import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/me', authenticate, ReferralController.getMyReferral);

export default router;
