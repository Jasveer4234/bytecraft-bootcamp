import { Terminal, ShieldCheck, Sparkles, ArrowRight, Code2, Server, Database } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-gray-800/60 bg-gradient-to-b from-[#0b0f19] via-[#0d1322] to-[#0b0f19]">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/10 to-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Cohort Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>6-Week Live Bootcamp • Fall 2026 Cohort</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Master <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Full-Stack Engineering</span> With Real Projects
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Transition from beginner concepts to architecting secure, deployable web applications using Next.js App Router, Express, TypeScript, MongoDB, and JWT HTTP-only authentication.
            </p>

            {/* Feature Badges */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900/80 border border-gray-800">
                <Code2 className="w-4 h-4 text-cyan-400" /> Next.js 16
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900/80 border border-gray-800">
                <Server className="w-4 h-4 text-blue-400" /> Node / Express
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900/80 border border-gray-800">
                <Database className="w-4 h-4 text-emerald-400" /> MongoDB / Mongoose
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900/80 border border-gray-800">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> JWT HTTP-Only
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#curriculum"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#blog"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-gray-300 hover:text-white bg-gray-900/90 hover:bg-gray-800 border border-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Latest Updates</span>
              </a>
            </div>
          </div>

          {/* Right Column Code Mockup */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden font-mono text-sm">
              {/* Window Header */}
              <div className="px-4 py-3 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>bytecraft-app.ts</span>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="p-5 overflow-x-auto text-xs sm:text-sm leading-relaxed text-gray-300 space-y-2">
                <p><span className="text-purple-400">import</span> express <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;express&apos;</span>;</p>
                <p><span className="text-purple-400">import</span> &#123; requireAuth, requireAdmin &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;./middleware/auth&apos;</span>;</p>
                <p><span className="text-purple-400">import</span> &#123; validate &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;./middleware/validate&apos;</span>;</p>
                <br />
                <p><span className="text-blue-400">const</span> app = <span className="text-yellow-300">express</span>();</p>
                <br />
                <p className="text-gray-500">&#47;&#47; Secure production route definition</p>
                <p>app.<span className="text-blue-300">post</span>(</p>
                <p className="pl-4"><span className="text-emerald-300">&apos;/api/admin/schedule&apos;</span>,</p>
                <p className="pl-4">requireAuth,</p>
                <p className="pl-4">requireAdmin,</p>
                <p className="pl-4">validate(createScheduleSchema),</p>
                <p className="pl-4"><span className="text-yellow-300">createScheduleController</span></p>
                <p>);</p>
                <br />
                <p className="text-gray-500">&#47;&#47; Server initialized</p>
                <p>app.<span className="text-blue-300">listen</span>(<span className="text-amber-400">5000</span>, () =&gt; &#123;</p>
                <p className="pl-4">console.<span className="text-blue-300">log</span>(<span className="text-emerald-300">&apos;🚀 ByteCraft API running on port 5000&apos;</span>);</p>
                <p>&#125;);</p>
              </div>

              {/* Terminal Footer Indicator */}
              <div className="px-4 py-2 bg-gray-900/60 border-t border-gray-800 text-[11px] text-cyan-400 flex items-center justify-between font-mono">
                <span>Status: 200 OK</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Cohort Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
