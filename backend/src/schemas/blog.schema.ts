import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty'),
  slug: z
    .string({ required_error: 'Slug is required' })
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (kebab-case)'),
  excerpt: z
    .string({ required_error: 'Excerpt is required' })
    .trim()
    .min(1, 'Excerpt cannot be empty'),
  content: z
    .string({ required_error: 'Content is required' })
    .min(1, 'Content cannot be empty'),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published'], {
    required_error: 'Status must be either draft or published',
  }),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
