import { Router } from 'express';
import { login, logout, getMe, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { requireAuth } from '../middleware/auth';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/register
router.post('/register', registerLimiter, validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', loginLimiter, validate(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', requireAuth, logout);

// GET /api/auth/me
router.get('/me', requireAuth, getMe);

export default router;
