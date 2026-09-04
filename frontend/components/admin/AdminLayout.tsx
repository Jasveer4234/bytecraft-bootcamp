'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  LogOut,
  Code2,
  Menu,
  X,
  Shield,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-gray-300">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto animate-spin">
            <Code2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-mono text-gray-400">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
    { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#080b12] border-r border-gray-800/80 fixed inset-y-0 z-30">
        {/* Branding Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              ByteCraft <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">Admin</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6 pb-2">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
              Quick Actions
            </span>
          </div>

          <Link
            href="/admin/blog/new"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/50 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Blog Post</span>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900/60 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Site</span>
          </a>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-800/80 bg-gray-950/50 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-bold text-xs">
              {user.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/50 border border-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#080b12]/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              aria-label="Toggle mobile menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-mono">
              <Shield className="w-3.5 h-3.5" /> ADMIN ROLE
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-[#080b12] border-b border-gray-800 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-200 hover:bg-gray-800"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
