'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchAdminBlogPosts, updateAdminBlogPostApi, BlogPost, ApiCustomError } from '@/lib/api';
import { ArrowLeft, Save, Eye, Edit3, Star, AlertCircle, RefreshCw } from 'lucide-react';

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const [previewMode, setPreviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchAdminBlogPosts()
      .then((allPosts) => {
        if (isMounted) {
          const found = allPosts.find((p) => p.id === id);
          if (found) {
            setPost(found);
            setTitle(found.title);
            setSlug(found.slug);
            setExcerpt(found.excerpt);
            setContent(found.content);
            setFeatured(found.featured);
            setStatus(found.status);
          } else {
            setError('Blog post not found.');
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to load post.';
          setError(msg);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !slug || !excerpt || !content) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await updateAdminBlogPostApi(id, {
        title,
        slug: slug.toLowerCase().trim(),
        excerpt,
        content,
        featured,
        status,
      });
      router.push('/admin/blog');
    } catch (err: unknown) {
      const apiErr = err as ApiCustomError;
      if (apiErr.status === 409) {
        setError('This slug is already in use. Please choose another slug.');
      } else {
        setError(apiErr.message || 'Failed to update blog post.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="p-12 text-center text-gray-400 space-y-4">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-cyan-400" />
          <p className="text-sm font-mono">Loading post details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!post && !loading) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="p-12 text-center text-gray-400 space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Post Not Found</h3>
          <p className="text-xs text-gray-400">The requested article could not be loaded.</p>
          <Link href="/admin/blog" className="inline-block px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-cyan-400 text-xs font-bold">
            Back to Blog Manager
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit Post: ${title || 'Untitled'}`}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back Link & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog Manager
          </Link>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                !previewMode ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Mode
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                previewMode ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview Mode
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Preview Container */}
        {previewMode ? (
          <div className="p-8 rounded-3xl bg-gray-950 border border-gray-800 space-y-6">
            <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Live Markdown Preview
              </span>
              <span className="text-xs text-gray-400">Status: {status.toUpperCase()}</span>
            </div>

            <div className="space-y-4">
              {featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> Featured Article
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-white">{title || 'Untitled Post'}</h1>
              <p className="text-gray-300 text-sm italic">{excerpt || 'No excerpt provided.'}</p>
            </div>

            <div className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed border-t border-gray-800 pt-6">
              <ReactMarkdown>{content || '*No content written yet.*'}</ReactMarkdown>
            </div>
          </div>
        ) : (
          /* Form Container */
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-gray-950 border border-gray-800 space-y-6 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block font-bold text-gray-300">Article Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-300">URL Slug * (Changing affects public URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-300">Publication Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="draft">DRAFT (Hidden from public)</option>
                  <option value="published">PUBLISHED (Live on public site)</option>
                </select>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block font-bold text-gray-300">Summary / Excerpt *</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 md:col-span-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-900 border-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="featured" className="font-bold text-gray-300 flex items-center gap-1.5 cursor-pointer">
                  <Star className="w-4 h-4 text-amber-400" /> Feature this article on the homepage
                </label>
              </div>

              {/* Markdown Content */}
              <div className="space-y-1.5 md:col-span-2 pt-2">
                <label className="block font-bold text-gray-300 flex items-center justify-between">
                  <span>Markdown Article Content *</span>
                  <span className="text-xs text-gray-500 font-mono">Supports standard Markdown tags</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  required
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800">
              <Link
                href="/admin/blog"
                className="px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Updating...' : 'Update Article'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
