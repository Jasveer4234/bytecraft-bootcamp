import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { ScheduleItem } from '../models/ScheduleItem';
import { BlogPost } from '../models/BlogPost';
import { hashPassword } from '../utils/password';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const seedData = async () => {
  console.log('[Seed Script]: Starting ByteCraft Bootcamp database seeding...');

  try {
    await connectDB();

    // 1. Seed Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@bytecraft.dev').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const passwordHash = await hashPassword(adminPassword);
      admin = await User.create({
        name: 'ByteCraft Lead Instructor',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
      console.log(`[Seed]: Created Admin user -> ${adminEmail}`);
    } else {
      console.log(`[Seed]: Admin user already exists -> ${adminEmail}`);
    }

    // 2. Seed Schedule Items (10 realistic sessions across 6 weeks)
    const scheduleItemsData = [
      {
        order: 1,
        dayOrDate: 'Week 1 — Day 1',
        title: 'Bootcamp Kickoff & Web Architecture Fundamentals',
        speaker: 'Jasveer Singh',
        description: 'Orientation to ByteCraft Bootcamp, client-server architecture, HTTP protocol deep dive, and modern full-stack workflows.',
      },
      {
        order: 2,
        dayOrDate: 'Week 1 — Day 3',
        title: 'TypeScript Deep Dive for Full-Stack Developers',
        speaker: 'Jasveer Singh',
        description: 'Mastering TypeScript type systems, interfaces, generics, module resolution, and strict compiler configurations for production Node & Next.js.',
      },
      {
        order: 3,
        dayOrDate: 'Week 2 — Day 1',
        title: 'Modern Frontend with Next.js App Router',
        speaker: 'Sarah Chen',
        description: 'Building server and client components, layout architectures, dynamic routing, streaming, and Tailwind CSS design systems.',
      },
      {
        order: 4,
        dayOrDate: 'Week 2 — Day 4',
        title: 'State Management & Form Handling in React 19',
        speaker: 'Sarah Chen',
        description: 'Optimistic UI updates, server actions, controlled form states, and robust client-side validation.',
      },
      {
        order: 5,
        dayOrDate: 'Week 3 — Day 2',
        title: 'Node.js & Express RESTful API Design',
        speaker: 'Jasveer Singh',
        description: 'Structuring production Express APIs, custom error handlers, request validation with Zod, and middleware pipelines.',
      },
      {
        order: 6,
        dayOrDate: 'Week 3 — Day 5',
        title: 'Database Modeling with MongoDB & Mongoose',
        speaker: 'Alex Rivera',
        description: 'Document database design, schema validation, indexing strategies for performance, and complex Mongoose aggregations.',
      },
      {
        order: 7,
        dayOrDate: 'Week 4 — Day 2',
        title: 'Authentication & Security: JWT & HTTP-Only Cookies',
        speaker: 'Jasveer Singh',
        description: 'Securing full-stack apps using JWTs stored strictly in HTTP-only cookies, password hashing with bcrypt, Helmet, and rate limiting.',
      },
      {
        order: 8,
        dayOrDate: 'Week 4 — Day 5',
        title: 'Role-Based Access Control (RBAC) & Middleware Design',
        speaker: 'Jasveer Singh',
        description: 'Implementing separated authentication vs authorization middleware layers for admin portals and public APIs.',
      },
      {
        order: 9,
        dayOrDate: 'Week 5 — Day 3',
        title: 'Full-Stack Integration & End-to-End Testing',
        speaker: 'Alex Rivera',
        description: 'Wiring Next.js frontend to Express API backend, CORS configuration, error boundaries, and integration test patterns.',
      },
      {
        order: 10,
        dayOrDate: 'Week 6 — Day 5',
        title: 'Capstone Showcase & Production Deployment',
        speaker: 'Jasveer Singh',
        description: 'Deploying Node/Express and Next.js applications to cloud platforms, environment configuration, monitoring, and final capstone presentations.',
      },
    ];

    for (const item of scheduleItemsData) {
      await ScheduleItem.findOneAndUpdate(
        { order: item.order },
        { $set: item },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed]: Seeded ${scheduleItemsData.length} schedule items.`);

    // 3. Seed Blog Posts (3 Published, 1 Draft, 1 Featured)
    const blogPostsData = [
      {
        title: 'Welcome to ByteCraft Bootcamp 2026: The Full-Stack Engineering Journey',
        slug: 'welcome-to-bytecraft-bootcamp-2026',
        excerpt: 'Discover what makes ByteCraft Bootcamp the definitive hands-on experience for aspiring full-stack engineers.',
        content: `
# Welcome to ByteCraft Bootcamp 2026

ByteCraft Bootcamp is designed to bridge the gap between academic computer science and production software engineering. 

## What You Will Learn
- **Frontend Masterclass**: Next.js App Router, TypeScript, and Tailwind CSS.
- **Backend Core**: Node.js, Express, MongoDB, and Mongoose ODM.
- **Production Security**: JWT in HTTP-Only cookies, Zod validation, rate limiting, and RBAC.

Join us as we build real-world software together!
        `.trim(),
        featured: true,
        status: 'published',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        author: admin._id,
      },
      {
        title: 'Why HTTP-Only Cookies are Crucial for Securing Web Applications',
        slug: 'why-http-only-cookies-are-crucial-for-securing-web-applications',
        excerpt: 'Storing JWTs in localStorage opens your app to XSS attacks. Learn why HTTP-only cookies are the industry standard.',
        content: `
# Securing Tokens with HTTP-Only Cookies

When implementing authentication in modern web applications, the placement of your JSON Web Tokens (JWT) directly impacts your vulnerability surface.

## The Problem with localStorage
If an attacker manages to execute cross-site scripting (XSS) on your frontend, any token saved in \`localStorage\` or \`sessionStorage\` can be read instantly via JavaScript:

\`\`\`js
const stolenToken = localStorage.getItem('token');
\`\`\`

## The HTTP-Only Cookie Solution
By issuing tokens inside HTTP-only, secure cookies, JavaScript running in the browser cannot read the cookie value. The browser automatically includes the cookie in same-origin HTTP requests.

- **\`httpOnly: true\`**: Blocks client-side JS access.
- **\`secure: true\`**: Ensures transmission over HTTPS.
- **\`sameSite: 'lax' | 'strict'\`**: Protects against Cross-Site Request Forgery (CSRF).
        `.trim(),
        featured: false,
        status: 'published',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        author: admin._id,
      },
      {
        title: 'Mastering Database-Level Filtering for Public Content',
        slug: 'mastering-database-level-filtering-for-public-content',
        excerpt: 'Why fetching all records and filtering drafts in React is a security risk, and how to query MongoDB directly.',
        content: `
# Database-Level Content Filtering

A common pitfall in web development is fetching all database records (including drafts) to the server or client, and filtering out unpublished items in application logic.

## Why Client-Side Filtering Fails
Even if React hides draft blog posts from rendered DOM elements, raw API responses sent over the network still contain draft titles, content, and sensitive unpublished metadata.

## The Query-Level Fix
Always filter at the database level:

\`\`\`ts
// Correct MongoDB query
const publicPosts = await BlogPost.find({ status: 'published' })
  .sort({ featured: -1, publishedAt: -1 });
\`\`\`

This guarantees unpublished drafts never leak across the wire.
        `.trim(),
        featured: false,
        status: 'published',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        author: admin._id,
      },
      {
        title: '[DRAFT] Upcoming Capstone Projects & Evaluation Guidelines',
        slug: 'upcoming-capstone-projects-and-evaluation-guidelines',
        excerpt: 'Preview of the final capstone project guidelines for ByteCraft Bootcamp candidates.',
        content: `
# Capstone Project Evaluation Matrix (Draft Internal Note)

This draft document outlines evaluation criteria for Round 2 interviews:
1. Architecture & Code Cleanliness.
2. Robust Error Handling & Zod Validation.
3. Database Query Performance & Security.
        `.trim(),
        featured: false,
        status: 'draft',
        publishedAt: null,
        author: admin._id,
      },
    ];

    for (const post of blogPostsData) {
      await BlogPost.findOneAndUpdate(
        { slug: post.slug },
        { $set: post },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed]: Seeded ${blogPostsData.length} blog posts (3 published, 1 draft).`);

    console.log('[Seed Script]: Seeding completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('[Seed Error]: Seeding failed —', error.message);
    process.exit(1);
  }
};

seedData();
