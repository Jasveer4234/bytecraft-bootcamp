import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { fetchPublicBlogPostBySlug } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Star, ShieldCheck } from 'lucide-react';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchPublicBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found — ByteCraft Bootcamp',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${post.title} — ByteCraft Bootcamp Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchPublicBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-cyan-500 selection:text-black">
      <Header />

      <main className="flex-grow py-12 lg:py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation Link */}
          <div className="mb-8">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Updates
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-6 pb-8 border-b border-gray-800 mb-10">
            {post.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> Featured Engineering Article
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 font-normal leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs sm:text-sm text-gray-400 border-t border-gray-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {post.author?.name ? post.author.name.charAt(0) : 'B'}
                </div>
                <div>
                  <p className="font-semibold text-white">{post.author?.name || 'ByteCraft Engineering'}</p>
                  <p className="text-xs text-gray-400">ByteCraft Author</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Post
                </span>
              </div>
            </div>
          </header>

          {/* Markdown Article Body */}
          <div className="prose prose-invert max-w-none space-y-6 text-gray-200 text-base leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl sm:text-2xl font-bold text-cyan-300 mt-6 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold text-white mt-4 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300 leading-relaxed">{children}</li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-cyan-300 font-mono text-sm">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="my-6 rounded-xl bg-gray-950 border border-gray-800 p-4 font-mono text-sm overflow-x-auto text-cyan-300">
                      <code>{children}</code>
                    </div>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-400 my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-800 flex items-center justify-between">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Homepage & Blog
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
