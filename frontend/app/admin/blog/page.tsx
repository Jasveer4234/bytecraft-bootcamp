'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  fetchAdminBlogPosts,
  updateAdminBlogPostApi,
  deleteAdminBlogPostApi,
  BlogPost,
} from '@/lib/api';
import { FileText, PlusCircle, Edit, Trash2, Star, CheckCircle2, FileEdit, AlertCircle, X } from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminBlogPosts();
      setPosts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load blog posts.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchAdminBlogPosts()
      .then((data) => {
        if (isMounted) {
          setPosts(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to load blog posts.';
          setError(msg);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    setError(null);
    setSuccessMsg(null);

    try {
      await updateAdminBlogPostApi(post.id, { status: newStatus });
      setSuccessMsg(
        newStatus === 'published'
          ? `Post '${post.title}' is now PUBLISHED and live on the public site.`
          : `Post '${post.title}' moved to DRAFT status.`
      );
      loadPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change post status.';
      setError(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteAdminBlogPostApi(deleteTarget.id);
      setSuccessMsg(`Deleted post '${deleteTarget.title}' successfully.`);
      setDeleteTarget(null);
      loadPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete blog post.';
      setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not Published';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AdminLayout title="Blog Management">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Engineering Articles & Posts</h2>
            <p className="text-xs text-gray-400 font-mono">
              Manage draft updates, publish posts, or toggle featured article status
            </p>
          </div>

          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 text-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Create New Post
          </Link>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error notification">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white" aria-label="Dismiss success notification">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Blog Post List */}
        {loading ? (
          <div className="p-8 rounded-2xl bg-gray-900/60 border border-gray-800 text-center animate-pulse space-y-4">
            <div className="h-6 bg-gray-800 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 rounded-2xl bg-gray-900/60 border border-gray-800 text-center space-y-4">
            <FileText className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Blog Posts Found</h3>
            <p className="text-xs text-gray-400">Click &quot;Create New Post&quot; to write your first Markdown article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-gray-950">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800 font-mono">
                <tr>
                  <th className="px-6 py-4">Title & Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Publication Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{post.title}</div>
                      <div className="text-xs font-mono text-cyan-400/80 mt-0.5">/blog/{post.slug}</div>
                    </td>

                    <td className="px-6 py-4">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold font-mono">
                          <CheckCircle2 className="w-3 h-3" /> PUBLISHED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-400 text-xs font-bold font-mono">
                          <FileEdit className="w-3 h-3" /> DRAFT
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {post.featured ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-4 h-4 fill-amber-400" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-mono">Standard</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                      {formatDate(post.publishedAt)}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          post.status === 'published'
                            ? 'bg-amber-950/60 border-amber-800 text-amber-400 hover:bg-amber-900'
                            : 'bg-emerald-950/60 border-emerald-800 text-emerald-400 hover:bg-emerald-900'
                        }`}
                        title={post.status === 'published' ? 'Unpublish to Draft' : 'Publish to Website'}
                      >
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>

                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="inline-block p-2 rounded-lg bg-gray-900 border border-gray-700 hover:border-cyan-500 text-cyan-400 transition-colors"
                        title="Edit Article"
                        aria-label={`Edit blog post: ${post.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="p-2 rounded-lg bg-gray-900 border border-gray-700 hover:border-red-500 text-red-400 transition-colors"
                        title="Delete Article"
                        aria-label={`Delete blog post: ${post.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Confirm Article Deletion</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">&apos;{deleteTarget.title}&apos;</strong>? This action will permanently remove the post.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 text-xs shadow-lg disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
