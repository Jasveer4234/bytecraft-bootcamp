'use client';

import { useEffect, useState } from 'react';
import { fetchSchedule, ScheduleItem } from '@/lib/api';
import { Calendar, User, Clock, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchSchedule()
      .then((items) => {
        setSchedule(items);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load the curriculum schedule right now. Please check back shortly.');
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    fetchSchedule()
      .then((items) => {
        if (isMounted) {
          setSchedule(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load the curriculum schedule right now. Please check back shortly.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="curriculum" className="py-20 bg-[#0b0f19] border-b border-gray-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum & Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive 6-Week Learning Path
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Every session is structured to advance your full-stack capabilities through live coding, architecture breakdowns, and direct feedback.
          </p>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse space-y-4">
                <div className="h-4 bg-gray-800 rounded w-1/4" />
                <div className="h-6 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error Fallback */}
        {!loading && error && (
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-red-950/30 border border-red-800/50 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Curriculum Schedule Unavailable</h3>
            <p className="text-gray-300 text-sm">{error}</p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/50 hover:bg-red-900 border border-red-700 text-white text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && schedule.length === 0 && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
            <Calendar className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Sessions Scheduled</h3>
            <p className="text-gray-400 text-sm">Check back soon for upcoming cohort dates and schedule updates.</p>
          </div>
        )}

        {/* Schedule Items Timeline */}
        {!loading && !error && schedule.length > 0 && (
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical Connecting Line */}
            <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-cyan-500/40 via-blue-500/40 to-indigo-500/40" />

            <div className="space-y-6">
              {schedule.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="relative sm:pl-20 group transition-all"
                >
                  {/* Timeline Badge/Dot */}
                  <div className="hidden sm:flex absolute left-4 top-6 w-8 h-8 rounded-full bg-gray-900 border-2 border-cyan-500 text-cyan-400 items-center justify-center font-mono text-xs font-bold shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                    {item.order}
                  </div>

                  {/* Card Container */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-gray-900/90 to-[#0e1424] border border-gray-800/80 hover:border-cyan-500/50 shadow-xl transition-all hover:shadow-cyan-500/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono text-xs font-semibold w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        {item.dayOrDate}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        Instructor: <strong className="text-gray-200">{item.speaker}</strong>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
