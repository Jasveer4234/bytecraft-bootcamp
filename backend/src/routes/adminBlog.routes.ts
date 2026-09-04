import { Router } from 'express';
import {
  getAdminBlogPosts,
  createAdminBlogPost,
  updateAdminBlogPost,
  deleteAdminBlogPost,
} from '../controllers/adminBlog.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBlogSchema, updateBlogSchema } from '../schemas/blog.schema';
import { writeLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protect all admin blog routes
router.use(requireAuth, requireAdmin);

// ADMIN BLOG: GET /api/admin/blog
router.get('/', getAdminBlogPosts);

// ADMIN BLOG: POST /api/admin/blog
router.post('/', writeLimiter, validate(createBlogSchema), createAdminBlogPost);

// ADMIN BLOG: PUT /api/admin/blog/:id
router.put('/:id', writeLimiter, validate(updateBlogSchema), updateAdminBlogPost);

// ADMIN BLOG: DELETE /api/admin/blog/:id
router.delete('/:id', writeLimiter, deleteAdminBlogPost);

export default router;
