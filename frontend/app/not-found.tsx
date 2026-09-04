import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-cyan-500 selection:text-black">
      <Header />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md mx-auto text-center p-10 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Article Not Found</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              The blog article or page you requested does not exist or may currently be in draft status.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
