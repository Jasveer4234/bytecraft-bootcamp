'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Code2, LayoutDashboard, Shield, LogOut, LogIn } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { name: 'Curriculum', href: '/#curriculum' },
    { name: 'Instructors', href: '/#instructors' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Blog & Updates', href: '/#blog' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1">
                ByteCraft <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">2026</span>
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Bootcamp</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800 hover:bg-cyan-900/60 transition-colors font-mono"
                  >
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Admin Portal</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 hover:border-cyan-400 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  className="text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors px-2 py-1 flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </Link>

                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all transform active:scale-95"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e1424] border-b border-gray-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-gray-800 hover:text-cyan-400"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-3 border-t border-gray-800/80 space-y-2">
            {!loading && user ? (
              <>
                <div className="px-3 py-1.5 text-xs text-gray-400 flex items-center justify-between font-mono">
                  <span>Signed in as: <strong className="text-white">{user.name}</strong></span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                    {user.role}
                  </span>
                </div>

                {user.role === 'admin' ? (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800"
                  >
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Admin Portal Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-950/40 border border-cyan-800/60"
                  >
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    <span>Student Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-950/40 border border-red-900/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-gray-200 hover:bg-gray-800 hover:text-cyan-400"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono text-gray-400 hover:bg-gray-800 hover:text-cyan-400"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Login</span>
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full mt-2 px-5 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
