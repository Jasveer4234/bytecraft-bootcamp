'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Code2,
  User as UserIcon,
  Mail,
  Calendar,
  BookOpen,
  LogOut,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-gray-300">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto animate-spin">
            <Code2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-mono text-gray-400">Loading Student Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="h-16 bg-[#080b12]/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                ByteCraft <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">Student</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/50 border border-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-blue-950/70 to-indigo-950/70 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ByteCraft Full-Stack Bootcamp 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your student account is active. Explore the bootcamp curriculum schedule, read developer deep dives, and follow along with live sessions.
            </p>
          </div>
        </div>

        {/* Account Details & Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Profile Card */}
          <div className="md:col-span-1 p-6 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">{user.name}</h2>
                <p className="text-xs text-gray-400 font-mono">{user.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Account Role</span>
                </span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase text-[11px]">
                  Student / Attendee
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span>User ID</span>
                </span>
                <span className="font-mono text-gray-300 text-[11px]">
                  {user.id ? `${user.id.slice(0, 8)}...` : 'Active'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>Status</span>
                </span>
                <span className="font-semibold text-emerald-400">Authenticated</span>
              </div>
            </div>
          </div>

          {/* Quick Access Actions */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/#curriculum"
              className="group p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-cyan-500/50 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Bootcamp Curriculum
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Browse through all 6 weeks of live sessions, dates, and architectural topics.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <span>View Timeline</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              href="/#blog"
              className="group p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-blue-500/50 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  Articles & Resources
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Read technical articles, system architecture guides, and curriculum updates.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <span>Browse Articles</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
