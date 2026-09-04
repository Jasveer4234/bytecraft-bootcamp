'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Who is ByteCraft Bootcamp designed for?',
      answer: 'ByteCraft Bootcamp is built for developers and computer science candidates seeking hands-on full-stack engineering skills. Whether you have foundational programming knowledge or want to upgrade from basic frontend to complete end-to-end applications, this program prepares you for production codebases.',
    },
    {
      question: 'What tech stack is taught during the 6 weeks?',
      answer: 'The core stack is standard and modern: Next.js (App Router), TypeScript, Tailwind CSS on the frontend; Node.js, Express, MongoDB, and Mongoose on the backend; with JWT authentication delivered via secure HTTP-only cookies and Zod validation schemas.',
    },
    {
      question: 'Are sessions live or self-paced?',
      answer: 'All cohort sessions are live interactive classes led by instructors, featuring real-time architecture walkthroughs, live debugging, and Q&A sessions. Recordings and codebase repositories are provided after each session.',
    },
    {
      question: 'Will I build a complete deployable project?',
      answer: 'Yes! Every candidate builds and deploys a complete Full-Stack Capstone project featuring user authentication, role-based authorization, rate-limited APIs, and responsive UI components.',
    },
    {
      question: 'How is security and authentication handled in the backend?',
      answer: 'We emphasize production security best practices: JSON Web Tokens (JWT) stored strictly in HTTP-only cookies (preventing client XSS leakage), password hashing using bcrypt, Zod validation, Helmet header protection, and rate limiting via express-rate-limit.',
    },
    {
      question: 'What are the prerequisites to join?',
      answer: 'Basic familiarity with JavaScript fundamentals (variables, functions, async/await) is recommended. We start with TypeScript foundations in Week 1 before moving to React, Next.js, and Express.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#0b0f19] border-b border-gray-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Everything you need to know about the ByteCraft Bootcamp curriculum, format, and admissions.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-gradient-to-b from-gray-900/90 to-[#0e1424] border border-gray-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left font-semibold text-white flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-gray-300 text-sm leading-relaxed border-t border-gray-800/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
