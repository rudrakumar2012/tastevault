# TasteVault Project Context

## Overview
TasteVault is a recipe discovery and personal vault application built with Next.js 16 and React 19. Users can search for recipes from Themealdb API, view detailed recipes, and save their favorite recipes to a personal vault with custom notes.

## Current State (as of 2026-04-02)

### ✅ Authentication
NextAuth v5 (beta) with **dual providers**:
- Google OAuth (one-click sign-in)
- Email/password (credentials-based with bcrypt hashing)
- Custom sign-in (`/auth/signin`) and registration (`/auth/register`) pages
- SEO metadata on auth pages
- Fixed spacing for fixed navbar

### ✅ Database
PostgreSQL (Neon serverless) with Drizzle ORM - **migrations applied**
- Tables: `users` (with password hash), `account` (NextAuth), `saved_recipes` (user-saved recipes with notes)
- Migration: `drizzle/0000_gorgeous_the_professor.sql` (includes password column)
- Type-safe queries with proper userId handling

### ✅ Frontend Design (Updated)
- **Dark theme** with colors: background `#0B0E14`, secondary `#18181B`, accent `#69F6B8`
- **Brand logo**: Crossed fork & knife on a plate (SVG) - consistent across Navbar, Footer, Auth pages, and favicon
- **Custom favicon**: SVG format with fork & knife design
- **Inline styles** (no Tailwind CSS component classes)
- **Framer Motion animations** throughout

#### 🎨 New Visual Enhancements
- **Hero section**: 3D floating recipe cards with gentle rotation and floating animation
- **Features section**: Replaced with Aceternity UI-inspired Bento Grid
  - Responsive grid (1/3/4 columns)
  - Glassmorphism cards with backdrop blur
  - Hover effects and staggered entrance animations
  - Two wide cards that span multiple columns
- **Navbar expansion**: Added About, Blog, Help links (previously only Discover)
- **Auth forms**: Enhanced with proper spacing, fixed broken "Forgot password?" link (now "Need help?" linking to /help)

#### Components
- **Client components**: Navbar, RecipeCard, Dashboard (client for state), AuthForm
- **Server components**: Home (landing page with Bento Grid + 3D hero), RecipeDetail, Auth pages, About/Blog/Help/Contact pages
- **Server actions**: saveApiRecipe, unsaveRecipe, updateRecipeNote, registerUser

### ✅ API Integration
- Themealdb API for recipe data
- API endpoints:
  - `GET /api/saved-recipes` - fetch user's saved recipes (requires auth)
  - `POST /api/auth/register` - register new user (email/password)

### ✅ Features Implemented
- Recipe discovery with search functionality
- Recipe detail pages (protected: redirect to login if not authenticated)
- Save recipe to vault (user-specific, DB insert)
- Unsave recipe (remove from vault)
- Custom authentication: sign-in + registration with email/password
- Dashboard page (`/dashboard`) with saved recipes grid
- Editable notes: add, edit, save, clear notes per saved recipe
- Category filter dropdown on dashboard
- Save button states: "Sign in to save" (logged out), "Save to Vault" (logged in unsaved), "Unsave" (saved)
- Home page shows correct saved state per user (fetched server-side)
- Navbar: expanded navigation, auth state, user avatar, sign-in/sign-out, "My Vault" link
- Real-time UI updates with server action revalidation

### ✅ Deployment Ready
- Vercel configuration: `vercel.json` created
- Comprehensive README.md with deployment instructions
- Environment variables documented
- Build errors fixed (import paths, TypeScript strictness)
- Ready for GitHub + Vercel auto-deploy

## Auth Configuration
- **Session strategy**: JWT
- **pages.signIn**: `/auth/signin` (custom page)
- **callbacks**: Adds `user.id` from token to session object

## Environment Variables (`.env.local`)
Required:
- `DATABASE_URL` - Neon/PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for JWT encryption (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - App URL (e.g., `http://localhost:3000` or `https://your-project.vercel.app`)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional, only if using Google sign-in)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)

## Key Files & Structure
- `app/layout.tsx` - Root layout with SessionProvider + favicon metadata
- `app/page.tsx` - Landing page with hero (3D floating cards) + Bento Grid
- `app/recipe/[id]/page.tsx` - Recipe detail view (protected)
- `app/dashboard/page.tsx` - User vault showing saved recipes
- `app/auth/signin/page.tsx` - Custom sign-in page with metadata
- `app/auth/register/page.tsx` - Registration page with metadata
- `app/about/page.tsx`, `app/blog/page.tsx`, `app/help/page.tsx`, `app/contact/page.tsx` - Info pages
- `components/Navbar.tsx` - Expanded navigation, search, auth state UI (fork & knife logo)
- `components/Footer.tsx` - Footer with links (fork & knife logo)
- `components/RecipeCard.tsx` - Recipe card with auth-aware save button
- `components/AuthForm.tsx` - Unified sign-in/signup form with enhanced UI
- `actions/recipe-actions.ts` - Server actions (saveApiRecipe, unsaveRecipe, updateRecipeNote)
- `actions/auth-actions.ts` - Server action (registerUser)
- `auth.ts` - NextAuth config (Google + Credentials providers)
- `db/schema.ts` - Database schema (users with password, accounts, saved_recipes)
- `db/index.ts` - Drizzle database connection using Neon
- `drizzle.config.ts` - Drizzle Kit configuration
- `public/favicon.svg` - Custom fork & knife on plate favicon
- `vercel.json` - Vercel build configuration

## Database Schema
**users**: id, name, email, emailVerified, image, password (bcrypt hash)
**account**: NextAuth adapter (provider, providerAccountId, userId, etc.)
**saved_recipes**: id, userId, mealId, title, image, category, note, createdAt

## Important Notes & Breaking Changes
- **Next.js 16/React 19**: APIs differ from standard training docs
  - `searchParams` and `params` are Promises requiring `await`
  - Read `node_modules/next/dist/docs/` for accurate info
- **NextAuth v5**: Uses `auth()` for server-side session access; `signIn()`/`signOut()` from `next-auth/react` or custom `auth.ts`
- **SessionProvider**: Must wrap root layout for client-side auth hooks
- **Server-only DB**: `db/index.ts` should only be imported in server components/actions
- **SVG in React**: Use camelCase for SVG attributes (`strokeWidth`, `strokeLinecap`, `strokeLinejoin`)
- **JSX comments**: Use `{/* */}` not `<!-- -->` inside SVG/JSX

## Development Priorities

### ✅ Completed
- [x] Database setup with Neon + Drizzle ORM
- [x] Dual authentication: Google OAuth + email/password (bcrypt)
- [x] Custom sign-in and registration pages with SEO metadata
- [x] Protected recipe detail routes (redirect to login)
- [x] Dashboard with saved recipes + category filter
- [x] Save/Unsave functionality
- [x] Editable notes (add, edit, clear)
- [x] API endpoint for fetching saved recipes
- [x] Database migration with `password` column
- [x] Landing page redesign: 3D hero + Bento Grid
- [x] Brand consistency: fork & knife logo across all pages
- [x] Custom favicon (SVG)
- [x] Expanded Navbar navigation
- [x] Responsive design with Framer Motion animations
- [x] TypeScript strict mode fixes (userId handling)
- [x] Vercel deployment configuration
- [x] Comprehensive README with deployment guide

### Optional Enhancements (future work)
- Email verification for credentials accounts
- Password reset flow
- Show saved recipe notes on recipe detail page
- Loading skeletons/UI polish
- Toast notifications for save/unsave/note actions
- Improved form validation (real-time feedback)
- Ability to reorder saved recipes
- Recipe search within vault
- Export/import vault list
- Share recipe link with saved note
- Progressive Web App (PWA) support
- Recipe meal planning/scheduling features

## Quick Start
1. Ensure `.env.local` has `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
2. Run `npx drizzle-kit migrate` (already done on dev DB)
3. Run `npm run dev`
4. Visit `http://localhost:3000`
5. Sign up or sign in to start saving recipes

## Technical Stack
- Next.js 16.2.1
- React 19.2.4
- NextAuth 5.0.0-beta.30
- Drizzle ORM 0.45.2 + Drizzle Kit 0.31.10
- Neon serverless driver @neondatabase/serverless 1.0.2
- Auth Drizzle adapter @auth/drizzle-adapter 1.11.1
- bcryptjs (password hashing)
- Framer Motion (animations)
- TypeScript 5
- ESLint 9
- TailwindCSS 4 (utility classes, custom configuration)

## Config & Setup
- Run `npm run dev` for development
- Required env vars in `.env.local`: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Optional for Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Generate and apply migrations after schema changes:
  ```bash
  npx drizzle-kit generate
  npx drizzle-kit migrate
  ```
- Deploy to Vercel with auto-deploy from GitHub main branch

## Design System
- **Typography**: Inter font (from next/font)
- **Colors**:
  - Background: `#0B0E14`
  - Surface: `#18181B`
  - Accent: `#69F6B8` (primary), `#4CD9A0` (hover/darker)
  - Foreground: `#FAFAFA`
  - Muted: `#A1A1AA`
- **Effects**:
  - Glassmorphism: `bg-surface/30` to `bg-surface/50` + `backdrop-blur-sm`
  - Gradients: `from-accent/5` to `via-transparent`
  - Shadows: `shadow-xl shadow-accent/20` with hover `shadow-accent/40`
  - Border radius: `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- **Animations**: Framer Motion (scale, rotate, y-translation, opacity, spring)
- **Logo**: Fork & knife crossed on plate (SVG, scales with container)
