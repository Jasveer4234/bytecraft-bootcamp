# ByteCraft Bootcamp — Development Plan

This document details the step-by-step phased development plan for the ByteCraft Bootcamp full-stack challenge.

---

## Phase Summary

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Project Foundation & Workspace Setup | **COMPLETED** |
| **Phase 2** | Database Connection & Mongoose Models with Zod Validation | Planned |
| **Phase 3** | Authentication & Authorization System (JWT in httpOnly cookie) | Planned |
| **Phase 4** | Backend API Endpoints (Schedule CRUD & Blog CRUD with DB-level Filtering) | Planned |
| **Phase 5** | Public Frontend Landing Page & Blog Post Views | Planned |
| **Phase 6** | Admin Dashboard & Markdown Blog Editor | Planned |
| **Phase 7** | Security Hardening, Rate Limiting & Final E2E Verification | Planned |

---

## Detailed Phase Breakdown

### Phase 1: Project Foundation (Completed)
- Set up root directory structure with `frontend/` (Next.js + TypeScript + Tailwind CSS) and `backend/` (Express + TypeScript).
- Configured environment handling (`.env.example` files for both frontend and backend).
- Verified clean compilation, build scripts, and TypeScript configurations.

---

### Phase 2: Database Connection & Mongoose Schemas with Zod Validation
- Establish MongoDB connection using Mongoose with retry logic and error logging.
- Define Mongoose Models & Schemas:
  - **User**: `name`, `email`, `passwordHash`, `role` (`"ADMIN"` | `"USER"`), `createdAt`, `updatedAt`
  - **ScheduleItem**: `title`, `dayOrDate`, `time`, `description`, `speaker`, `order`, `createdAt`, `updatedAt`
  - **BlogPost**: `title`, `slug`, `excerpt`, `content`, `author`, `featured`, `status` (`"draft"` | `"published"`), `publishedAt`, `createdAt`, `updatedAt`
- Define Zod Schemas for input validation on all write endpoints:
  - Auth validation (`loginSchema`)
  - Schedule validation (`scheduleItemSchema`)
  - Blog validation (`blogPostSchema`)

---

### Phase 3: Authentication & Authorization Engine
- **Authentication Middleware (`requireAuth`)**:
  - Verify JWT from `httpOnly` cookie (`token`).
  - Attach authenticated user details to `req.user`.
  - Return HTTP 401 on missing or invalid token.
- **Authorization Middleware (`requireRole('ADMIN')`)**:
  - Verify `req.user.role === 'ADMIN'`.
  - Return HTTP 403 on insufficient role.
- Auth API Endpoints:
  - `POST /api/auth/login`: Validate credentials with `bcryptjs`, set `httpOnly` cookie, return user summary without `passwordHash`.
  - `POST /api/auth/logout`: Clear authentication cookie.
  - `GET /api/auth/me`: Return currently logged-in admin user info.

---

### Phase 4: Backend API Controllers & Routes

#### Public Blog Endpoints (STRICT DB-LEVEL FILTERING)
- `GET /api/blog`: Returns list of published posts (`{ status: 'published' }` enforced at database query level).
- `GET /api/blog/:slug`: Returns a single published post by slug (`{ slug, status: 'published' }`). Returns 404 if post is draft or nonexistent.

#### Public Schedule Endpoint
- `GET /api/schedule`: Returns schedule items sorted by `order`.

#### Admin Schedule Endpoints (Protected: `requireAuth` + `requireRole('ADMIN')`)
- `POST /api/schedule`: Create schedule item (Zod validated).
- `PUT /api/schedule/:id`: Update schedule item (Zod validated).
- `DELETE /api/schedule/:id`: Delete schedule item.

#### Admin Blog Endpoints (Protected: `requireAuth` + `requireRole('ADMIN')`)
- `GET /api/admin/blog`: Fetch all blog posts (both `draft` and `published`).
- `POST /api/admin/blog`: Create blog post (Zod validated, generates slug).
- `PUT /api/admin/blog/:id`: Update post (Zod validated, manages draft/published status & `publishedAt`).
- `DELETE /api/admin/blog/:id`: Delete post.

---

### Phase 5: Public Frontend Landing Page & Blog Views
- **Homepage (`/`)**:
  - **Hero Section**: Engaging title, tagline, registration CTA.
  - **Schedule / Curriculum Section**: Dynamic schedule list fetched from `/api/schedule`.
  - **Speakers / Instructors Section**: Cards showcasing event speakers.
  - **FAQ Accordion**: Expandable common questions.
  - **Latest Blog / News Section**: Dynamic list of published blog posts directly on the homepage.
  - **Footer & Registration CTA**.
- **Individual Blog Post Page (`/blog/[slug]`)**:
  - Render post title, author, date, excerpt, and rendered Markdown content.
  - Handle 404 cleanly when a post is unpublished or missing.

---

### Phase 6: Admin Portal & Markdown Blog Editor
- **`/admin/login`**: Clean login form posting credentials to `/api/auth/login`.
- **`/admin/dashboard`**: Protected layout displaying system statistics and navigation to Schedule & Blog management.
- **`/admin/schedule`**: Interactive schedule manager (create, edit inline/modal, reorder, delete).
- **`/admin/blog`**: Blog post manager displaying status badges (`draft` vs `published`), action buttons.
- **`/admin/blog/new` & `/admin/blog/[id]/edit`**:
  - Blog post form with Markdown editor & live preview mode.
  - Draft vs Publish toggle button.

---

### Phase 7: Security Hardening, Rate Limiting & Verification
- Apply `express-rate-limit` to `/api/auth/login` and write endpoints.
- Verify central error handling (ensure stack traces are suppressed in production).
- Verify `passwordHash` is omitted from all JSON outputs.
- Comprehensive end-to-end testing of public and admin flows.
