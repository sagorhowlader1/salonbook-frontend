# AGENTS.md

# SalonBook – AI Agent Development Guide

## 1. Project Overview

SalonBook is a full-stack salon appointment booking platform.

The platform allows customers to explore salon services, book appointments, manage bookings, and complete online payments.

Administrators can manage services, users, appointments, and payment transactions through an admin dashboard.

The project consists of two separate repositories:

- Frontend: Next.js application.
- Backend: Express.js REST API.

## 2. Project Repositories

**Frontend Repository:**
https://github.com/sagorhowlader1/salonbook-frontend

**Backend Repository:**
https://github.com/sagorhowlader1/salonbook-backend

**Live Website:**
https://salonbook-frontend.vercel.app

## 3. Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Better Auth
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB Native Driver
- Stripe
- Multer
- ImgBB

### Database
MongoDB database name: `salonbook`

Collections:
- `services`
- `users`
- `appointments`
- `transactions`
- `payments`

## 4. Main Application Features

### Customer
- Registration and login.
- Browse salon services.
- View service details.
- Book appointments.
- View appointment history.
- Cancel appointments.
- Complete online payments.
- View transaction information.
- Manage profile.

### Admin
- Admin dashboard.
- Manage salon services.
- Add, update, and delete services.
- Manage appointments.
- Manage registered users.
- View transactions.
- Manage profile.

## 5. Authentication & Authorization

- Better Auth is used for authentication.
- User sessions must be verified before accessing protected resources.
- User roles determine dashboard access.
- Customer and admin routes must remain protected.
- Never rely only on frontend navigation to enforce authorization.
- Backend operations must validate the relevant customer identity and internal API authorization where required.
- Customers must not access admin-only resources.
- Never expose secret keys or internal API credentials to client-side code.

## 6. Appointment & Payment Rules

### Appointment Management
- Only available/active services should be bookable.
- Validate appointment information before saving.
- Customers should only access their own appointments.
- Unauthorized users must not cancel or modify another customer's appointment.
- Maintain consistent appointment status values:
  - Pending
  - Confirmed
  - Cancelled

### Payment Management
- Stripe is used for online payments.
- Payment verification must happen on the server.
- Never trust payment status supplied by the browser.
- Verify Stripe payment information before updating database records.
- Prevent unauthorized payment verification.
- Keep appointment and transaction information consistent.

## 7. Backend API Guidelines

- Backend runs on port `5000`.
- Use Express.js for API development.
- Use MongoDB Native Driver for database operations.
- Validate request parameters and request bodies.
- Handle API errors using appropriate HTTP status codes.
- Protect internal endpoints using the configured internal API secret.
- Validate customer identity for customer-specific operations.
- Do not expose database credentials or API secrets.

## 8. Coding Guidelines

### General
- Write clean, readable, and maintainable code.
- Follow the existing project architecture.
- Use meaningful variable and function names.
- Avoid unnecessary code duplication.
- Keep components reusable.
- Make small, focused changes.
- Do not introduce unnecessary dependencies.

### Frontend
- Use TypeScript.
- Follow Next.js App Router conventions.
- Use Client Components only when client-side functionality is required.
- Use Server Components where appropriate.
- Keep API communication organized.
- Add loading, error, and empty states.
- Maintain responsive layouts.
- Follow the existing UI design system.

### Backend
- Use async/await for asynchronous operations.
- Handle errors properly.
- Validate incoming data.
- Keep database operations secure.
- Avoid duplicating API logic.

## 9. UI/UX Guidelines

- Maintain a professional salon and beauty industry design.
- Keep the interface clean and user-friendly.
- Ensure responsive behavior on mobile, tablet, and desktop.
- Maintain consistent spacing, typography, and colors.
- Use clear feedback messages for user actions.
- Provide loading indicators where necessary.
- Ensure buttons and interactive elements have clear purposes.

## 10. Environment Variables & Security

Never commit `.env` files or secret credentials.

Important environment variable names include:

### Frontend
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_DB_URI`
- `BACKEND_API_URL`
- `INTERNAL_API_SECRET`
- `STRIPE_SECRET_KEY`

### Backend
- `MONGODB_URI`
- `STRIPE_SECRET_KEY`
- `INTERNAL_API_SECRET`
- `IMGBB_API_KEY`

Always check the existing `.env` configuration before introducing or renaming environment variables.

Never expose private credentials through `NEXT_PUBLIC_` environment variables.

## 11. Instructions for AI Coding Agents

Before modifying the project:

1. Inspect the existing code and folder structure.
2. Understand the current implementation.
3. Identify the root cause before fixing an issue.
4. Follow existing coding conventions.
5. Avoid rewriting working code unnecessarily.
6. Do not remove existing features without permission.
7. Do not change API contracts without checking frontend and backend dependencies.
8. Preserve authentication and authorization rules.
9. Check responsive behavior after UI changes.
10. Explain important changes clearly.

When implementing a new feature:

- Identify the affected frontend and backend files.
- Keep frontend and backend responsibilities separate.
- Validate user input.
- Handle loading and error states.
- Check authentication and authorization.
- Test the affected functionality.

## 12. Final Development Rules

- Do not invent API endpoints.
- Do not assume database fields without checking existing schemas and data.
- Do not hardcode secret values.
- Do not bypass authentication.
- Do not expose sensitive customer information.
- Do not break existing functionality.
- Prefer minimal and maintainable solutions.

**Important:** Always inspect the existing implementation before making changes. Preserve the established architecture and functionality of SalonBook.

---

**Project:** SalonBook  
**Developer:** Sagor Howlader









BEGIN:nextjs-agent-rules

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SalonBook frontend

Small Next.js 16 (App Router) app; code lives under `src/` (`app/`, `components/ui/`, `lib/`).

## Commands
- `npm run dev` — Turbopack dev server on localhost:3000
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`); running it with no args lints the whole repo
- `npx tsc --noEmit` — typecheck; there is no `typecheck` script
- `npm run build` / `npm run start`
- No test framework is configured; don't invent test commands.

## Config quirks
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler` (React Compiler 1.0): async data fetching needs Suspense boundaries / `use cache` per Next 16 rules, and React Compiler auto-memoizes — don't add manual `useMemo`/`useCallback`/`React.memo` unless profiling shows a need.
- Tailwind CSS v4, CSS-first: theme tokens live in `src/app/globals.css`; there is no `tailwind.config` file. Compiled through `@tailwindcss/turbopack` via turbopack rules in `next.config.ts`.
- shadcn/ui uses the `base-nova` style backed by Base UI (`@base-ui/react`) — not Radix, so component APIs differ from older shadcn examples. UI primitives live in `src/components/ui`; add new ones with `npx shadcn add <component>` (aliases configured in `components.json`), don't hand-roll them.
- Path alias `@/*` → `./src/*` (tsconfig `paths`).
