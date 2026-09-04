import { Router } from 'express';
import { getPublicBlogPosts, getPublicBlogPostBySlug } from '../controllers/blog.controller';

const router = Router();

// PUBLIC BLOG: GET /api/blog (Only published posts, DB-level filtered)
router.get('/', getPublicBlogPosts);

// PUBLIC BLOG: GET /api/blog/:slug (Only published post by slug, draft returns 404)
router.get('/:slug', getPublicBlogPostBySlug);

export default router;
