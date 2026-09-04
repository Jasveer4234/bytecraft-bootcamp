'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchSchedule, fetchAdminBlogPosts, BlogPost } from '@/lib/api';
import { Calendar, FileText, Star, PlusCircle, ArrowRight, CheckCircle2, FileEdit } from 'lucide-react';

export default function AdminDashboardPage() {
  const [scheduleCount, setScheduleCount] = useState<number>(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchSchedule().catch(() => []),
      fetchAdminBlogPosts().catch(() => []),
    ]).then(([schedData, blogData]) => {
      if (isMounted) {
        setScheduleCount(schedData.length);
        setBlogPosts(blogData);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const publishedCount = blogPosts.filter((p) => p.status === 'published').length;
  const draftCount = blogPosts.filter((p) => p.status === 'draft').length;
  const featuredCount = blogPosts.filter((p) => p.featured).length;

  return (
    <AdminLayout title="System Overview">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-indigo-950/80 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to ByteCraft Admin
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Manage your bootcamp curriculum sessions, published news, and blog articles from a single control panel.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Schedule Sessions */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Sessions</span>
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{loading ? '...' : scheduleCount}</p>
            <p className="text-xs text-gray-400 font-mono">Curriculum items ordered</p>
          </div>

          {/* Card 2: Published Posts */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Published Posts</span>
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{loading ? '...' : publishedCount}</p>
            <p className="text-xs text-gray-400 font-mono">Live on public website</p>
          </div>

          {/* Card 3: Draft Posts */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Draft Posts</span>
              <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
                <FileEdit className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{loading ? '...' : draftCount}</p>
            <p className="text-xs text-gray-400 font-mono">Protected from public view</p>
          </div>

          {/* Card 4: Featured Posts */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Featured Posts</span>
              <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                <Star className="w-5 h-5 fill-indigo-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{loading ? '...' : featuredCount}</p>
            <p className="text-xs text-gray-400 font-mono">Prioritized on homepage</p>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/schedule"
            className="group p-6 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-cyan-500/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Manage Schedule
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add, edit, reorder, or delete curriculum timeline sessions.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-cyan-400">
              <span>Open Schedule Manager</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/blog"
            className="group p-6 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-blue-500/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                Manage Blog Posts
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                View all draft & published posts, toggle publication status, and edit content.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-blue-400">
              <span>Open Blog Manager</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/blog/new"
            className="group p-6 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Create New Article
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Write a new Markdown article with live preview mode and status controls.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span>New Markdown Post</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
