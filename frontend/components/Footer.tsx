import Link from 'next/link';
import { Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="register" className="bg-[#080b12] border-t border-gray-800/80 pt-16 pb-12 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Registration CTA Banner */}
        <div className="mb-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-blue-950/60 to-indigo-950/60 border border-cyan-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Build Your Full-Stack Future?
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto">
            Applications for our upcoming Fall 2026 Live Cohort will be opening shortly. Space is limited to 30 candidates per cohort.
          </p>

          <div className="pt-2">
            <button
              disabled
              className="px-8 py-3.5 rounded-xl text-base font-bold text-gray-300 bg-gray-900 border border-cyan-500/40 cursor-not-allowed opacity-90 shadow-lg inline-flex items-center gap-2"
            >
              <span>Registration Opens Soon</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </button>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800/60">
          {/* Col 1 Branding */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">ByteCraft Bootcamp</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              The premier hands-on full-stack engineering challenge. Learn to design, secure, validate, and deploy production web applications.
            </p>
          </div>

          {/* Col 2 Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#curriculum" className="hover:text-cyan-400 transition-colors">Curriculum</a></li>
              <li><a href="#instructors" className="hover:text-cyan-400 transition-colors">Instructors</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
              <li><a href="#blog" className="hover:text-cyan-400 transition-colors">Blog & Updates</a></li>
            </ul>
          </div>

          {/* Col 3 Stack Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200">Tech Stack</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 transition-colors">Next.js App Router</li>
              <li className="hover:text-cyan-400 transition-colors">TypeScript & Tailwind CSS</li>
              <li className="hover:text-cyan-400 transition-colors">Node.js & Express API</li>
              <li className="hover:text-cyan-400 transition-colors">MongoDB & Mongoose</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ByteCraft Bootcamp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 font-mono">Full-Stack Hiring Challenge — Phase 4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
