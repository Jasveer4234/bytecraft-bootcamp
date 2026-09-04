import { Request, Response, NextFunction } from 'express';
import { BlogPost } from '../models/BlogPost';
import { ApiError } from '../utils/ApiError';

export const getPublicBlogPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // DATABASE QUERY LEVEL FILTERING — NEVER expose draft posts to public users
    const posts = await BlogPost.find({ status: 'published' })
      .sort({ featured: -1, publishedAt: -1 })
      .limit(6)
      .populate('author', 'name email')
      .exec();

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicBlogPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugParam = req.params.slug as string;

    if (!slugParam) {
      return next(ApiError.badRequest('Slug parameter is required'));
    }

    // DATABASE QUERY LEVEL FILTERING — Draft posts return 404
    const post = await BlogPost.findOne({ slug: slugParam.toLowerCase(), status: 'published' })
      .populate('author', 'name email')
      .exec();

    if (!post) {
      return next(ApiError.notFound('Blog post not found'));
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
