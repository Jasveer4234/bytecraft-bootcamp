# ByteCraft Bootcamp — Full-Stack Platform

ByteCraft Bootcamp is a production-ready full-stack platform designed for managing and displaying bootcamp curriculum schedules, instructor bios, FAQs, public engineering news/articles, and a secure content management Admin Portal.

---

## 🚀 Project Overview

The application features:
- **Public Landing Page (`/`):** Responsive dark-theme website containing Hero, 6-week Curriculum Schedule, Instructors, FAQ Accordion, Public Blog/News Section, and Registration CTA.
- **Public Article Detail (`/blog/[slug]`):** Safe Markdown article renderer with dynamic meta tags, author details, and back navigation.
- **Admin Portal (`/admin/*`):** Authenticated control panel featuring JWT `httpOnly` cookie auth, dashboard metrics, curriculum schedule manager, and blog post editor with live Markdown preview.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla Tailwind CSS
- **Markdown:** `react-markdown`
- **Icons:** `lucide-react`

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM

### Security & Validation
- **Authentication:** JWT in `httpOnly` secure cookies
- **Password Hashing:** `bcryptjs`
- **Validation:** Zod schemas (`auth`, `schedule`, `blog`)
- **Security:** Helmet, CORS (credentialed), `express-rate-limit`

---

## 🔐 Demo / Development Admin Credentials

> [!IMPORTANT]
> **DEMO / DEVELOPMENT ONLY**
> Use the following credentials after running `npm run seed` in the `backend/` directory:
> - **Email:** `admin@bytecraft.dev`
> - **Password:** `AdminPass123!`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bytecraft
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)
Copy `frontend/.env.example` to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection URI

### 1. Backend Setup & Data Seeding
```bash
cd backend
npm install
cp .env.example .env
npm run seed     # Seeds demo admin user, 10 schedule sessions, and 4 blog posts (3 published, 1 draft)
npm run dev      # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev      # Starts Next.js server on http://localhost:3000
```

---

## 📡 API Endpoint Inventory

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates admin credentials & sets `httpOnly` cookie |
| `POST` | `/api/auth/logout` | Authenticated | Clears `httpOnly` cookie |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile |
| `GET` | `/api/schedule` | Public | Fetches curriculum schedule items sorted by `order` |
| `POST` | `/api/schedule` | Admin Only | Creates new curriculum schedule session |
| `PUT` | `/api/schedule/:id` | Admin Only | Updates curriculum schedule session |
| `DELETE` | `/api/schedule/:id` | Admin Only | Deletes curriculum schedule session |
| `GET` | `/api/blog` | Public | Fetches published blog posts (`status: 'published'`) |
| `GET` | `/api/blog/:slug` | Public | Fetches individual published blog post by slug |
| `GET` | `/api/admin/blog` | Admin Only | Fetches all blog posts including drafts |
| `POST` | `/api/admin/blog` | Admin Only | Creates new blog post (draft or published) |
| `PUT` | `/api/admin/blog/:id` | Admin Only | Updates blog post fields or status transition |
| `DELETE` | `/api/admin/blog/:id` | Admin Only | Deletes blog post |

---

## 🧪 Testing & Verification

### Backend Build & Tests
```bash
cd backend
npm run type-check  # Validates TypeScript types
npm run build       # Compiles TypeScript to dist/
npm test            # Runs automated endpoint structure test runner
```

### Frontend Build & Linting
```bash
cd frontend
npm run lint        # Runs ESLint checks (0 errors, 0 warnings)
npm run build       # Builds Next.js production bundle (0 errors)
```

---

## 🚢 Deployment Readiness

- **Frontend:** Configured for Vercel / Netlify deployment. Supply `NEXT_PUBLIC_API_BASE_URL` pointing to deployed backend API.
- **Backend:** Configured for Render / Railway / Fly.io deployment. Supply `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, and set `NODE_ENV=production`.
- **Database:** Fully compatible with MongoDB Atlas.
