# 🎓 Veltro LMS - Frontend Next.js 16 (App Router)

Enterprise-grade Learning Management System (LMS) frontend web application built with **Next.js 16**, **React 19**, **TypeScript**, **SCSS Modules**, and a dedicated **Backend For Frontend (BFF)** architecture featuring clean high-end aesthetics and optimized user experience.

> 🔗 **Official Backend:** This frontend pairs with the enterprise **NestJS + PostgreSQL 18 + Prisma 7** API: [lms-nest-postgres](https://github.com/Cr1stofe/lms-nest-postgres).

---

## 🛠️ Architecture & Tech Stack

- **Framework:** [Next.js 16 (App Router / Turbopack)](https://nextjs.org/) (Server Components, Client Components, Edge/Node Proxies, Streaming & SSR)
- **Core Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict typing across domain, stores, and components)
- **Styling & Design System:** **SCSS Modules** (`.module.scss`), CSS Variables, Mixins, and Clean Light (Porcelain & Royal Cobalt) theme
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Atomic decoupled stores for Auth and LMS domain)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) integrated with [Zod](https://zod.dev/) via `@hookform/resolvers/zod`
- **Testing Suite:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/) (40 Unit & Integration test suites)
- **UI Icons & Toasts:** [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.emilkowal.ski/)
- **Media & Streaming:** HTML5 Video Player with HTTP 206 Partial Content range request support and responsive fallback

---

## 🚀 Key Features

### 🔐 Authentication & Role-Based Access Control (RBAC)
- **User Roles:**
  - **Administrator (`admin`):** Full platform control (Course & Lesson management, user directory search with pagination).
  - **Editor (`editor`):** Course and lesson authoring access.
  - **Student (`user`):** Enrolled courses catalog, lesson curriculum progression, and PDF certificate downloads.
  - **Public / Visitor (`public`):** Public course syllabus overview and free preview lessons (*free tags*).
- **Edge Route Protection:** Server-side auth gating with zero layout flicker.
- **Secure Sessions:** Protected with `httpOnly` secure session cookies (`__Secure-sid`).

### 📚 Learning Experience & Curriculum Player
- **Dynamic Course Catalog:** Real-time syllabus duration counters and lesson progression indicators.
- **Access Lock Barrier:** Clean visual gate for premium content prompting login or registration.
- **Curriculum Controls:** Standardized navigation controls (Previous, Complete Lesson with semantic success feedback, Next / Course Syllabus).
- **PDF Certificate Issuance:** Automated vector certificate view upon 100% course completion.

### ⚙️ Admin Dashboard
- **Course Management:** Reactive slug generation and instant catalog updates.
- **Lesson Management:** Video storage path linkage and public/private flag toggles.
- **User Directory:** Debounced real-time search by name/email with responsive truncated pagination.

---

## 🛡️ Route Permissions Matrix

| Route | Public | Student (`user`) | Editor (`editor`) | Administrator (`admin`) |
| :--- | :---: | :---: | :---: | :---: |
| `/` (Home) | 🟢 Public | 🟢 Personalized | 🟢 Admin Dashboard | 🟢 Admin Dashboard |
| `/cursos` (Catalog) | 🟢 Open | 🟢 Open | 🟢 Open | 🟢 Open |
| `/cursos/[slug]` (Detail) | 🟢 Open | 🟢 Open | 🟢 Open | 🟢 Open |
| `/aula/[courseSlug]/[lessonSlug]` | 🟡 Free Lessons Only | 🟢 Full Access | 🟢 Full Access | 🟢 Full Access |
| `/certificados` | 🔴 Login Required | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed |
| `/admin/cursos` | 🔴 Login Required | 🔴 Redirects `/cursos` | 🟢 Allowed | 🟢 Allowed |
| `/admin/aulas` | 🔴 Login Required | 🔴 Redirects `/cursos` | 🟢 Allowed | 🟢 Allowed |
| `/admin/usuarios` | 🔴 Login Required | 🔴 Redirects `/cursos` | 🔴 Redirects `/admin/cursos` | 🟢 Allowed |

---

## 🧪 Testing & Quality Assurance

The frontend includes a **Vitest + React Testing Library** test suite:

```bash
yarn test
yarn test:watch
```

### 📋 Test Coverage Overview (40 Test Suites)
- **Utils (`src/lib/utils.test.ts`):** `secToMin`, `formatDate`, `generateId`, and `slugify`.
- **API Client (`src/lib/api-client.test.ts`):** `resolveVideoUrl` storage resolution.
- **Zod Schemas (`src/lib/schemas/`):** Strict payload validation for auth and LMS operations.
- **Zustand Stores (`src/stores/`):** Isolated tests for `useAuthStore` and `useLMSStore`.
- **Services (`src/services/`):** API communication and mock contracts.
- **UI Components (`src/components/`):** `VideoPlayer` rendering/error states and `Navbar` RBAC link rendering.

---

## 📂 Project Structure

```text
src/
├── app/                              # Next.js App Router pages & route handlers
│   ├── admin/                        # Admin Dashboard (Courses, Lessons, Users)
│   ├── api/                          # BFF Proxy Route Handlers (Auth, LMS, Files)
│   ├── aula/[courseSlug]/[lessonSlug]# Lesson player & curriculum navigation
│   ├── certificados/                 # Earned certificates view
│   ├── cursos/                       # Course catalog and syllabus detail
│   ├── (auth)/                       # Login, Create Account, Password Recovery
│   ├── layout.tsx                    # Root layout with Toaster & typography
│   └── page.tsx                      # Dynamic home landing page
├── components/                       # Reusable domain & UI components
│   ├── CourseCard/                   # Interactive course card
│   ├── Footer/                       # Global footer
│   ├── Navbar/                       # Responsive navbar with user profile pill
│   ├── ProgressBar/                  # Curriculum completion progress bar
│   ├── SessionInitializer/           # Initial auth session sync
│   └── VideoPlayer/                  # HTML5 video player with fallback states
├── lib/                              # Core configuration, schemas, and types
│   ├── config.ts                     # Centralized environment variables
│   ├── api-client.ts                 # Typed HTTP client helper
│   ├── types.ts                      # Domain TypeScript interfaces
│   └── schemas/                      # Zod validation schemas (Auth & LMS)
├── services/                         # Service layer communicating with API
│   ├── authService.ts                # Session, login, registration operations
│   └── lmsService.ts                 # Course, lesson, user, certificate operations
├── stores/                           # Global Zustand atomic stores
│   ├── useAuthStore.ts               # Authentication state & actions
│   └── useLMSStore.ts                # Courses & lessons catalog state
├── styles/                           # SCSS Design System & Tokens
│   ├── _variables.scss               # Color tokens, fonts, radii, spacing scale
│   ├── _mixins.scss                  # Glassmorphism, buttons, inputs, responsive breakpoints
│   └── globals.scss                  # Global resets, typography, and utility classes
└── test/                             # Testing configuration and global setup
    └── setup.ts                      # Jest-DOM matchers and Next.js mocks
```

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js >= 24.x
- Yarn >= 4.x

### 2. Environment Setup
Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure your backend endpoint:
```env
BACKEND_API_URL=https://localhost/api
```

### 3. Development Server

```bash
yarn dev
```

Visit [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Production Build & Validation

```bash
yarn build
yarn lint
yarn test
```
