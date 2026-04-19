# Tourist Shopping List App

A mobile-first web app helping international tourists manage shopping lists and discover nearby stores — MVP: Tokyo, Japan.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19 + Vite 6                   |
| Routing     | React Router v7                     |
| Database    | Supabase (PostgreSQL)               |
| Store AI    | Claude API (Anthropic)              |
| Maps        | Google Maps Embed API / Mapbox      |
| Hosting     | Vercel                              |

---

## Local Development

### 1. Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A [Supabase](https://supabase.com) project

### 2. Install Dependencies

```bash
cd app
npm install
```

### 3. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key   # or VITE_MAPBOX_TOKEN
CLAUDE_API_KEY=your-claude-api-key              # server-side only
```

### 4. Set Up Database

Run the schema in your Supabase project's SQL editor:

```bash
# Copy and paste the contents of supabase/schema.sql
# into Supabase → SQL Editor → New query → Run
```

### 5. Start Dev Server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Routes

| Path   | Page       | Description                                |
|--------|------------|--------------------------------------------|
| `/`    | List View  | Shopping list — add, manage, mark as bought |
| `/map` | Map View   | Map with store pins + bottom sheet         |

---

## Deployment to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
cd app
vercel                    # first deploy (follow prompts)
vercel --prod             # production deploy
```

During setup, set the **Root Directory** to `app/` and add environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Option B — GitHub Integration (Recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo.
3. Set **Root Directory** → `app`.
4. Add all `VITE_*` env vars (and `CLAUDE_API_KEY` for server functions).
5. Click **Deploy**.

Vercel auto-deploys on every push to `main`.

### Build Settings (Vercel)

| Setting           | Value           |
|-------------------|-----------------|
| Framework Preset  | Vite            |
| Root Directory    | `app`           |
| Build Command     | `npm run build` |
| Output Directory  | `dist`          |
| Install Command   | `npm install`   |

---

## Project Structure

```
app/
├── public/                  # Static assets
├── src/
│   ├── lib/
│   │   └── supabase.js      # Supabase client singleton
│   ├── pages/
│   │   ├── ListPage.jsx     # / — Shopping list view
│   │   └── MapPage.jsx      # /map — Map view
│   ├── components/          # Shared UI components (to be built)
│   ├── App.jsx              # Router + routes
│   ├── index.css            # Design tokens + global styles
│   └── main.jsx             # React entry point
├── supabase/
│   └── schema.sql           # Database schema
├── .env.example             # Env var template
└── vite.config.js
```

---

## Design Reference

Visual identity tokens (colours, typography, spacing) are defined in:
- `src/index.css` — CSS custom properties
- `../design/visual-identity.md` — full design system spec

**Primary colour:** Tokyoite Blue `#1B5FE8`
**Accent:** Neon Tangerine `#FF6B2B` (FAB, key CTAs)
**Success:** Jade `#00B896` (purchased state)
**Fonts:** Plus Jakarta Sans (headings) + Inter (UI)

---

## Budget

Target: **€20–40/month** total infrastructure.

| Service     | Estimated cost           |
|-------------|--------------------------|
| Supabase    | Free tier (MVP)          |
| Vercel      | Free tier (Hobby)        |
| Claude API  | ~€5–15/mo (usage-based)  |
| Google Maps | Free tier (28k loads/mo) |
