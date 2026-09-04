import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema } from '../schemas/auth.schema';
import { requireAuth } from '../middleware/auth';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/login
router.post('/login', loginLimiter, validate(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', requireAuth, logout);

// GET /api/auth/me
router.get('/me', requireAuth, getMe);

export default router;
