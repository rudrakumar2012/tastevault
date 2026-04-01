# TasteVault

Your personal recipe vault. Discover, save, and organize your favorite recipes with custom notes. Built with Next.js 16, React 19, and Neon PostgreSQL.

![TasteVault Banner](https://via.placeholder.com/1200x400/0B0E14/69F6B8?text=TasteVault)

## ✨ Features

- 🔍 **Recipe Discovery** - Search thousands of recipes from Themealdb API
- 💾 **Save to Vault** - Save favorites with custom notes
- 📝 **Personal Notes** - Add cooking tips and substitutions
- 🔐 **Dual Authentication** - Google OAuth or email/password
- 🎨 **Premium UI** - Dark theme with smooth animations
- 📱 **Responsive Design** - Works on all devices

## 🚀 Tech Stack

- **Framework:** Next.js 16.2.1 (App Router)
- **UI:** React 19.2.4, Framer Motion
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Auth:** NextAuth v5 (beta)
- **Styling:** Tailwind CSS 4 (custom colors)

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL account
- Google Cloud account (optional, for OAuth)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tastevault.git
   cd tastevault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` in the project root:
   ```env
   DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id  # optional
   GOOGLE_CLIENT_SECRET=your-google-secret  # optional
   ```
   Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`

4. **Set up the database**
   ```bash
   npx drizzle-kit migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment on Vercel

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Click **New Project** → Import `rudrakumar2012/tastevault`
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `.`
   - Build Command: `npm run build`
5. Add **Environment Variables** (see below)
6. Click **Deploy**

### Environment Variables (Vercel)

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for JWT encryption (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` (your production URL) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (optional) |

### Post-Deploy Setup

1. **Update Google OAuth** (if using):
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to **APIs & Services → Credentials**
   - Edit your OAuth 2.0 Client
   - Add **Authorized redirect URI:**
     ```
     https://your-project.vercel.app/api/auth/callback/google
     ```

2. **Update `NEXTAUTH_URL` locally** to match production for testing:
   ```env
   NEXTAUTH_URL=https://your-project.vercel.app
   ```

3. **Redeploy** - Vercel auto-deploys on every push to `main`.

## 🗄️ Database Schema

```sql
-- Users (managed by NextAuth)
users: id, name, email, emailVerified, image, password

-- Saved recipes (with custom notes)
saved_recipes: id, userId, mealId, title, image, category, note, createdAt
```

Migrations are managed via Drizzle Kit:
```bash
npx drizzle-kit generate  # after schema changes
npx drizzle-kit migrate   # apply migrations
```

## 📚 API Routes

- `POST /api/auth/register` - Register new user (email/password)
- `GET /api/auth/session` - Get current session
- Server Actions: `saveApiRecipe`, `unsaveRecipe`, `updateRecipeNote`

## 🧪 Testing

```bash
# Development
npm run dev

# Build
npm run build

# Start production build
npm start

# Lint
npm run lint
```

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with recipe discovery |
| `/discover` | Browse and search recipes |
| `/recipe/[id]` | Recipe details (protected) |
| `/dashboard` | User's saved recipes vault |
| `/auth/signin` | Sign in page |
| `/auth/register` | Registration page |
| `/about`, `/blog`, `/help`, `/contact` | Info pages |
| `/privacy`, `/terms` | Legal pages |

## 🎨 Design

- **Colors:** Background `#0B0E14`, Surface `#18181B`, Accent `#69F6B8`
- **Typography:** Inter (via next/font)
- **Animations:** Framer Motion
- **Logo:** Crossed fork & knife on a plate

## 📝 License

MIT

---

Built with ❤️ by the TasteVault team.
