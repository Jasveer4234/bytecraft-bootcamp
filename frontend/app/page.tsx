import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScheduleSection from '@/components/ScheduleSection';
import InstructorsSection from '@/components/InstructorsSection';
import FaqSection from '@/components/FaqSection';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ByteCraft Bootcamp — 6-Week Live Full-Stack Engineering Program',
  description: 'Master full-stack web development with Next.js App Router, Express, TypeScript, MongoDB, and JWT HTTP-only security in an intensive live bootcamp.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-cyan-500 selection:text-black">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ScheduleSection />
        <InstructorsSection />
        <FaqSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
