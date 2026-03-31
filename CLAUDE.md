# TasteVault Project Context

## Overview
TasteVault is a recipe discovery and personal vault application built with Next.js 16 and React 19. Users can search for recipes from Themealdb API, view detailed recipes, and save their favorite recipes to a personal vault with custom notes.

## Current State (as of 2026-04-01)
- **Authentication**: ✅ NextAuth v5 (beta) with **dual providers**:
  - Google OAuth (one-click sign-in)
  - Email/password (credentials-based with bcrypt hashing)
  - Custom sign-in (`/auth/signin`) and registration (`/auth/register`) pages
- **Database**: ✅ PostgreSQL (Neon serverless) with Drizzle ORM - **migrations applied**
  - Tables: `users` (with password hash), `account` (NextAuth), `saved_recipes` (user-saved recipes with notes)
  - Migration: `drizzle/0000_gorgeous_the_professor.sql` (includes password column)
- **Frontend**:
  - Dark theme with colors: background `#0B0E14`, secondary `#18181B`, accent `#69F6B8`
  - Inline styles (no Tailwind CSS component classes)
  - Client components: Navbar, RecipeCard, Dashboard (client for state)
  - Server components: Home, RecipeDetail, Auth pages
  - Server actions: saveApiRecipe, unsaveRecipe, updateRecipeNote, registerUser
- **API Integration**: Themealdb API for recipe data
- **API Endpoints**:
  - `GET /api/saved-recipes` - fetch user's saved recipes (requires auth)
- **Features implemented** (✅ Complete):
  - ✅ Recipe discovery with random terms fallback
  - ✅ Search functionality
  - ✅ Recipe detail pages (protected: redirect to login if not authenticated)
  - ✅ Save recipe to vault (user-specific, DB insert)
  - ✅ Unsave recipe (remove from vault)
  - ✅ Custom authentication: sign-in + registration with email/password
  - ✅ Dashboard page (`/dashboard`) with saved recipes grid
  - ✅ Editable notes: add, edit, save, clear notes per saved recipe
  - ✅ Category filter dropdown on dashboard
  - ✅ Save button states: "Sign in to save" (logged out), "Save to Vault" (logged in unsaved), "Unsave" (saved)
  - ✅ Home page shows correct saved state per user (fetched server-side)
  - ✅ Navbar: auth state, user avatar, sign-in/sign-out, "My Vault" link
  - ✅ Real-time UI updates with server action revalidation

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

## Development Priorities

### ✅ Completed (as of 2026-04-01)
- [x] Database setup with Neon + Drizzle ORM
- [x] Dual authentication: Google OAuth + email/password (bcrypt)
- [x] Custom sign-in and registration pages
- [x] Protected recipe detail routes (redirect to login)
- [x] Dashboard with saved recipes
- [x] Save/Unsave functionality
- [x] Editable notes (add, edit, clear)
- [x] Category filter on dashboard
- [x] API endpoint for fetching saved recipes
- [x] Database migration with `password` column

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
