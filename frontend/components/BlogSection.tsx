'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPublicBlogPosts, BlogPost } from '@/lib/api';
import { Newspaper, Star, ArrowRight, Calendar, User, AlertCircle, RefreshCw } from 'lucide-react';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = () => {
    setLoading(true);
    setError(null);
    fetchPublicBlogPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load the latest ByteCraft blog updates right now.');
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    fetchPublicBlogPosts()
      .then((data) => {
        if (isMounted) {
          setPosts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load the latest ByteCraft blog updates right now.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section id="blog" className="py-20 bg-[#0d1322] border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Latest News & Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ByteCraft Blog & Engineering Articles
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Technical guides, architecture breakdowns, and bootcamp announcements written by our engineering team.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse space-y-4">
                <div className="h-4 bg-gray-800 rounded w-1/3" />
                <div className="h-6 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error Fallback */}
        {!loading && error && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-red-950/30 border border-red-800/50 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Articles Unavailable</h3>
            <p className="text-gray-300 text-sm">{error}</p>
            <button
              onClick={loadPosts}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/50 hover:bg-red-900 border border-red-700 text-white text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
            <Newspaper className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Articles Published</h3>
            <p className="text-gray-400 text-sm">Stay tuned! New engineering articles and announcements will be published soon.</p>
          </div>
        )}

        {/* Blog Cards Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className={`group flex flex-col justify-between p-7 rounded-2xl bg-gradient-to-b from-gray-900/90 to-[#0b0f19] border transition-all duration-300 hover:-translate-y-1 shadow-xl ${
                  post.featured
                    ? 'border-amber-500/50 ring-1 ring-amber-500/20 shadow-amber-500/5'
                    : 'border-gray-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  {/* Featured Badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {post.featured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-400 text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured Post
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-mono">Article</span>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-3">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Footer Author & CTA Link */}
                <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    {post.author?.name || 'ByteCraft Team'}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5"
                  >
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
