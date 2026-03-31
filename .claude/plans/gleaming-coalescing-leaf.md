# Implementation Plan: Authentication & Dashboard

## Context
The TasteVault app currently has NextAuth v5 backend setup but lacks frontend authentication integration. Users cannot sign in/out, the save button doesn't check auth status, recipe details are publicly accessible, and there's no dashboard to view saved recipes. This plan implements complete authentication flow with protected routes and a user vault.

## User Requirements (Decided)
- **Sign-in page**: Use NextAuth's default UI (no custom page needed)
- **Recipe detail protection**: Auto-redirect to sign-in if not logged in
- **Save button behavior**: Disabled with message "Sign in to save" when logged out

## Implementation Strategy

### Phase 1: Session Provider Integration
**Why**: NextAuth requires `SessionProvider` at the root to make session data available to client components.

**File**: `app/layout.tsx`
- Import `SessionProvider` from `next-auth/react`
- Wrap the entire `<body>` children with `<SessionProvider>`
- Keep Navbar inside SessionProvider so it can use `useSession()`

### Phase 2: Navbar Authentication UI
**File**: `components/Navbar.tsx`
- Import `useSession` from `next-auth/react` and `signIn`, `signOut` from `auth.ts` (client-safe wrapper)
- Use `useSession()` to get `data` and `status`
- Add conditional rendering:
  - If `status === "loading"`: show loading state
  - If `status === "unauthenticated"`: show "Sign in" button that calls `signIn('google')`
  - If `status === "authenticated"`: show user avatar (from `data.user?.image`) with dropdown containing:
    - User email/name display
    - "My Vault" link to `/dashboard`
    - "Sign out" button that calls `signOut()`
- Style to match dark theme (use existing color palette)

### Phase 3: Protected Recipe Detail Page
**File**: `app/recipe/[id]/page.tsx`
- Import `auth` from `auth.ts`
- Create server component that checks authentication using `const session = await auth()`
- If `!session` or `session.user` is null, redirect to `/api/auth/signin?callbackUrl=/recipe/[id]`
- Return recipe content only if authenticated
- Pass `userId` to client components if needed (for saved state checking)

### Phase 4: Dashboard Page (My Vault)
**File**: `app/dashboard/page.tsx` (new)
- Server component: `const session = await auth()`
- Redirect to sign-in if not authenticated
- Fetch user's saved recipes from database:
  - Import `db` and `savedRecipes` from `db/schema.ts`
  - Query: `SELECT * FROM saved_recipes WHERE userId = session.user.id ORDER BY createdAt DESC`
- Render page showing:
  - Header: "My Vault" with user info
  - Grid of RecipeCard components (reuse existing component)
  - Pass saved recipe data in format RecipeCard expects (or create new SavedRecipeCard component)
  - Show notes for each saved recipe (from `saved_recipes.note`)
  - Allow editing notes inline (future enhancement)
- Style consistent with existing pages

### Phase 5: Fix RecipeCard Save Button
**File**: `components/RecipeCard.tsx`
- Import `useSession` to check auth status
- Modify save button:
  - If unauthenticated: disabled, show "Sign in to save", gray background
  - If authenticated: enable saving as before
- Click handler for unauthenticated: `signIn('google')` to trigger sign-in
- Keep existing saved state logic (but this should now be user-specific)

### Phase 6: Server Action - Save to Database
**File**: `actions/recipe-actions.ts`
- Convert from simulated to real implementation:
  - Import `auth` from `auth.ts`
  - Get `session = await auth()` to retrieve `userId`
  - If no session, throw error (or return unauthorized)
  - Import `db` and `savedRecipes` from `db/schema.ts`
  - Check if recipe already saved for this user (unique constraint on userId+mealId)
  - Insert into `saved_recipes`: `{ userId, mealId, title, image, category, note: '' }`
  - Return success/failure
- Keep `revalidatePath('/')` for cache invalidation
- Error handling for duplicates (use `onConflictDoNothing` or check first)

### Phase 7: Show Saved State on RecipeCard (Optional but Recommended)
**File**: `components/RecipeCard.tsx` or Server Component enhancement
- To show "Saved" vs "Save" correctly, we need to know if current user already saved this recipe
- Option A (server component): Pass `isSaved` prop from parent page that queries DB
- Option B (client component): Fetch saved recipes on client, maintain state
- Recommendation: Modify Home page and Dashboard to fetch saved recipe IDs for current user and pass `isSaved` to RecipeCard

### Phase 8: Update Home Page to Show Saved State
**File**: `app/page.tsx`
- Import `auth` to get user session (server component)
- If authenticated, fetch list of saved `mealId`s for this user from `saved_recipes`
- Pass `savedRecipeIds` set to the RecipeCard components
- RecipeCard checks if `recipe.idMeal` is in saved set to display "✓ Saved"

### Phase 9: Database Migration Check
- Ensure `.env.local` has `DATABASE_URL`
- Run `npx drizzle-kit generate` to create migrations (if schema changed)
- Run `npx drizzle-kit migrate` to apply migrations
- Verify tables exist: `users`, `account`, `saved_recipes`

## File Changes Summary
1. **Modify**: `app/layout.tsx` - Add SessionProvider
2. **Modify**: `components/Navbar.tsx` - Add auth UI with signIn/signOut
3. **Modify**: `app/recipe/[id]/page.tsx` - Add auth check and redirect
4. **Create**: `app/dashboard/page.tsx` - User vault page
5. **Modify**: `components/RecipeCard.tsx` - Auth-aware save button
6. **Modify**: `actions/recipe-actions.ts` - Real database insert with session check
7. **Modify**: `app/page.tsx` - Fetch saved recipe IDs and pass to cards

## Verification & Testing
1. **SessionProvider**: Run `npm run dev`, Navbar should show "Sign in" initially
2. **Sign-in flow**: Click "Sign in", should redirect to Google OAuth, then back to home
3. **Navbar state**: After sign-in, should show avatar and "My Vault" link
4. **Protected recipe**: Visit `/recipe/52772` (example) while logged out → should redirect to sign-in
5. **Save functionality**:
   - Logged out: Save button shows "Sign in to save" (disabled)
   - Logged in: Click "Save to Vault", should save to DB and show "✓ Saved"
6. **Dashboard**: Visit `/dashboard` → should show saved recipes (empty initially)
7. **Dashboard protection**: Try `/dashboard` while logged out → should redirect to sign-in
8. **Database**: Check `saved_recipes` table has entries after saving

## Notes
- NextAuth v5 beta uses `auth()` function in Server Components/Route Handlers
- `signIn` and `signOut` must be imported from `auth.ts` (not from `next-auth/react`) for type safety in client components
- The `saved_recipes` table already has `userId, mealId, title, image, category, note` columns - perfect for our needs
- NextAuth default sign-in page is at `/api/auth/signin` and automatically provides Google provider button

## Dependencies & Prerequisites
- `.env.local` must have:
  - `DATABASE_URL` (Neon/PostgreSQL connection)
  - `NEXTAUTH_URL` (e.g., `http://localhost:3000`)
  - `NEXTAUTH_SECRET` (generated secret)
- Google OAuth credentials configured in NextAuth (if not, setup required)
