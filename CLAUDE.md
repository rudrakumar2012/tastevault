# TasteVault Project Context

## Overview
TasteVault is a recipe discovery and personal vault application built with Next.js 16 and React 19. Users can search for recipes from Themealdb API, view detailed recipes, and save their favorite recipes to a personal vault with custom notes.

## Current State (as of 2026-03-31)
- **Authentication**: ✅ NextAuth v5 (beta) with **dual providers**:
  - Google OAuth (one-click sign-in)
  - Email/password (credentials-based with bcrypt hashing)
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
  - Tables: `users` (with password hash), `account` (NextAuth), `saved_recipes` (user-saved recipes with notes)
- **Frontend**:
  - Dark theme with colors: background `#0B0E14`, secondary `#18181B`, accent `#69F6B8`
  - Inline styles (no Tailwind CSS component classes)
  - Client components: Navbar, RecipeCard
  - Server components: Home, RecipeDetail, Dashboard, Auth pages
  - Server actions: saveApiRecipe, registerUser
- **API Integration**: Themealdb API for recipe data
- **Features implemented**:
  - ✅ Recipe discovery with random terms fallback
  - ✅ Search functionality
  - ✅ Recipe detail pages (protected: redirect to login if not authenticated)
  - ✅ Save recipe to vault with real database insert (user-specific)
  - ✅ Custom authentication pages: `/auth/signin`, `/auth/register`
  - ✅ Dashboard page (`/dashboard`) showing saved recipes
  - ✅ Save button logic: disabled with "Sign in to save" when logged out; "Save to Vault" when logged in; "✓ Saved" when already saved
  - ✅ Navbar shows sign-in/sign-out and user avatar
  - ✅ Home page shows correct saved state for each recipe card
  - ✅ Email/password registration with server-side validation and bcrypt hashing

## Auth Configuration
- **session strategy**: JWT
- **pages.signIn**: `/auth/signin` (custom page)
- **callbacks**: Adds `user.id` from token to session object

## Environment Variables (`.env.local`)
Required:
- `DATABASE_URL` - Neon/PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for JWT encryption (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - App URL (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional, only if using Google sign-in)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)

## Key Files & Structure
- `app/layout.tsx` - Root layout with SessionProvider
- `app/page.tsx` - Home/Discovery page (server component, fetches saved recipes for user)
- `app/recipe/[id]/page.tsx` - Recipe detail view (protected)
- `app/dashboard/page.tsx` - User vault showing saved recipes
- `app/auth/signin/page.tsx` - Custom sign-in page (Google + credentials form)
- `app/auth/register/page.tsx` - Registration page for email/password accounts
- `components/Navbar.tsx` - Navigation, search, auth state UI
- `components/RecipeCard.tsx` - Recipe card with auth-aware save button
- `actions/recipe-actions.ts` - `saveApiRecipe` server action (DB insert with session check)
- `actions/auth-actions.ts` - `registerUser` server action (bcrypt hashing, duplicate check)
- `auth.ts` - NextAuth config (Google + Credentials providers)
- `db/schema.ts` - Database schema (users with password, accounts, saved_recipes)
- `db/index.ts` - Drizzle database connection using Neon
- `drizzle.config.ts` - Drizzle Kit configuration

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

## Development Priorities (remaining)
1. ⚠️ **Database migration**: Add `password` column to `users` table:
   - `npx drizzle-kit generate`
   - `npx drizzle-kit migrate`
2. **Google OAuth**: Ensure authorized origins/redirect URIs match localhost:3000
3. **Optional enhancements**:
   - Edit notes on saved recipes (edit `saved_recipes.note`)
   - Show saved notes on recipe detail page for saved items
   - Add unsave functionality (delete from `saved_recipes`)
   - Email verification for credentials accounts
   - Password reset flow
   - Loading states/skeletons in UI
   - Form validation improvements
   - Toast notifications for actions

## Technical Stack
- Next.js 16.2.1
- React 19.2.4
- NextAuth 5.0.0-beta.30
- Drizzle ORM 0.45.2 + Drizzle Kit 0.31.10
- Neon serverless driver @neondatabase/serverless 1.0.2
- Auth Drizzle adapter @auth/drizzle-adapter 1.11.1
- bcryptjs (password hashing)
- TypeScript 5
- ESLint 9
- TailwindCSS 4 (not actively used in components)

## Config & Setup
- Run `npm run dev` for development
- Required env vars in `.env.local`: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Optional for Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Generate and apply migrations after schema changes:
  ```bash
  npx drizzle-kit generate
  npx drizzle-kit migrate
  ```
