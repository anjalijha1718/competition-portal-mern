import { Router } from 'express';
import { CompetitionController } from '../controllers/competition.controller.js';
import { RegistrationController } from '../controllers/registration.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.js';
import { registrationLimiter } from '../middlewares/rateLimit.js';
import { validate } from '../middlewares/validate.js';
import {
  competitionSlugSchema,
  competitionIdSchema,
  submissionSchema,
} from '../validators/competition.validator.js';

const router = Router();

// Public / optionally authenticated competition endpoints
router.get('/', CompetitionController.listCompetitions);
router.get('/:slug', optionalAuthenticate, validate(competitionSlugSchema), CompetitionController.getCompetition);

// Registration & Submission endpoints (Authenticated)
router.post(
  '/:id/register',
  registrationLimiter,
  authenticate,
  validate(competitionIdSchema),
  RegistrationController.registerForCompetition
);

router.get(
  '/:id/my-registration',
  authenticate,
  validate(competitionIdSchema),
  RegistrationController.getMyRegistration
);

router.post(
  '/:id/submission',
  authenticate,
  validate(submissionSchema),
  RegistrationController.submitEntry
);

export default router;
