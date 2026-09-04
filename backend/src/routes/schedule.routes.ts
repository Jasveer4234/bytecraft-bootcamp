import { Router } from 'express';
import {
  getPublicSchedule,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
} from '../controllers/schedule.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createScheduleSchema, updateScheduleSchema } from '../schemas/schedule.schema';
import { writeLimiter } from '../middleware/rateLimiter';

const router = Router();

// PUBLIC: GET /api/schedule
router.get('/', getPublicSchedule);

// ADMIN: POST /api/schedule
router.post(
  '/',
  requireAuth,
  requireAdmin,
  writeLimiter,
  validate(createScheduleSchema),
  createScheduleItem
);

// ADMIN: PUT /api/schedule/:id
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  writeLimiter,
  validate(updateScheduleSchema),
  updateScheduleItem
);

// ADMIN: DELETE /api/schedule/:id
router.delete('/:id', requireAuth, requireAdmin, writeLimiter, deleteScheduleItem);

export default router;
