import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { registerUserSchema, loginUserSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerUserSchema), AuthController.register);
router.post('/login', validate(loginUserSchema), AuthController.login);
router.get('/me', authenticate, AuthController.getMe);

export default router;
