import { Response, NextFunction } from 'express';
import { BlogPost } from '../models/BlogPost';
import { ApiError } from '../utils/ApiError';
import { validateObjectId } from '../utils/validateObjectId';
import { AuthenticatedRequest } from '../types';

export const getAdminBlogPosts = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email role')
      .exec();

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, slug, excerpt, content, featured, status } = req.body;

    const normalizedSlug = slug.toLowerCase().trim();

    // Check slug uniqueness
    const existingPost = await BlogPost.findOne({ slug: normalizedSlug });
    if (existingPost) {
      return next(ApiError.conflict(`A blog post with slug '${normalizedSlug}' already exists.`));
    }

    const publishedAt = status === 'published' ? new Date() : null;

    const newPost = await BlogPost.create({
      title,
      slug: normalizedSlug,
      excerpt,
      content,
      featured: Boolean(featured),
      status,
      author: req.user!.userId,
      publishedAt,
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newPost,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(ApiError.conflict('A blog post with this slug already exists.'));
    }
    next(error);
  }
};

export const updateAdminBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    validateObjectId(id, 'Blog Post ID');

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return next(ApiError.notFound('Blog post not found'));
    }

    const { title, slug, excerpt, content, featured, status } = req.body;

    if (slug) {
      const normalizedSlug = slug.toLowerCase().trim();
      if (normalizedSlug !== existingPost.slug) {
        const slugOwner = await BlogPost.findOne({ slug: normalizedSlug });
        if (slugOwner && slugOwner._id.toString() !== id) {
          return next(ApiError.conflict(`A blog post with slug '${normalizedSlug}' already exists.`));
        }
        existingPost.slug = normalizedSlug;
      }
    }

    if (title !== undefined) existingPost.title = title;
    if (excerpt !== undefined) existingPost.excerpt = excerpt;
    if (content !== undefined) existingPost.content = content;
    if (featured !== undefined) existingPost.featured = Boolean(featured);

    if (status !== undefined && status !== existingPost.status) {
      existingPost.status = status;
      if (status === 'published') {
        // Transition draft -> published
        existingPost.publishedAt = existingPost.publishedAt || new Date();
      } else if (status === 'draft') {
        // Transition published -> draft
        existingPost.publishedAt = null;
      }
    }

    await existingPost.save();

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: existingPost,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(ApiError.conflict('A blog post with this slug already exists.'));
    }
    next(error);
  }
};

export const deleteAdminBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    validateObjectId(id, 'Blog Post ID');

    const deletedPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedPost) {
      return next(ApiError.notFound('Blog post not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
