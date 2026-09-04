import { Users, Terminal } from 'lucide-react';

export default function InstructorsSection() {
  const instructors = [
    {
      name: 'Jasveer Singh',
      role: 'Lead Architect & Bootcamp Founder',
      expertise: ['Node.js', 'Express', 'JWT & Security', 'TypeScript'],
      bio: 'Full-stack software architect with 10+ years of experience designing high-throughput distributed systems and API infrastructure.',
      initials: 'JS',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Sarah Chen',
      role: 'Senior Frontend Engineer',
      expertise: ['React 19', 'Next.js App Router', 'Tailwind CSS', 'State Management'],
      bio: 'Frontend specialist focused on performant user interfaces, responsive design systems, and client-side optimization.',
      initials: 'SC',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Alex Rivera',
      role: 'Backend & Data Engineer',
      expertise: ['MongoDB', 'Mongoose ODM', 'API Performance', 'System Design'],
      bio: 'Database engineer passionate about schema design, indexing strategies, document aggregation, and backend scalability.',
      initials: 'AR',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="instructors" className="py-20 bg-[#0d1322] border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/50 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Expert Mentorship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learn Directly From Industry Engineers
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Our fictional instruction team brings practical engineering experience to guide your cohort through live code reviews and project builds.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {instructors.map((ins, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-gradient-to-b from-gray-900/90 to-[#0b0f19] border border-gray-800 hover:border-indigo-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Avatar Treatment */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ins.color} flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform`}>
                  {ins.initials}
                </div>
                <div className="p-2 rounded-lg bg-gray-800/60 text-gray-400">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              {/* Title & Role */}
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {ins.name}
              </h3>
              <p className="text-xs font-semibold text-cyan-400 mb-4">{ins.role}</p>

              {/* Bio */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {ins.bio}
              </p>

              {/* Expertise Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {ins.expertise.map((exp, eIdx) => (
                  <span
                    key={eIdx}
                    className="px-2.5 py-1 rounded-md bg-gray-950/80 border border-gray-800 text-[11px] font-mono text-gray-300"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
