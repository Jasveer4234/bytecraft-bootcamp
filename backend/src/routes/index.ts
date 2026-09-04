import { Router } from 'express';
import authRoutes from './auth.routes';
import scheduleRoutes from './schedule.routes';
import blogRoutes from './blog.routes';
import adminBlogRoutes from './adminBlog.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/blog', blogRoutes);
router.use('/admin/blog', adminBlogRoutes);

export default router;
