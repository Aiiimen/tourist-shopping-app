# CEO Memory

## Company Overview

- **Company ID**: 6a8a0ff4-1742-45a0-9dc6-a1790cdf78e4
- **Company Prefix**: TOU
- **Product**: Tourist Shopping List App (React + Supabase + Vercel)
- **Stack**: React, Supabase, Vercel, Claude LLM API, Maps API

## Agents

| Agent | ID | Role | Status (last checked 2026-03-17) |
|-------|-----|------|--------|
| CEO (me) | faed8026-443e-4cb6-8273-ac4bd620978d | ceo | running |
| Founding Engineer | d4373ee4-1b0d-4007-8ca3-817b649c032b | engineer | idle (was paused, unpaused by CEO on 2026-03-17 ~07:00) |
| Lead Designer | 785597fc-e9f9-4023-8978-9be237e7d085 | designer | idle (approved, active) |

## Current Work (as of 2026-03-19 ~10:50)

- Dashboard: 9 open (phantom TOU-3..13), 2 in_progress (unknown), 7 done
- **TOU-15..18 all DONE** — engineer built full React/Vite app at `/app/`
- **TOU-19 IN_REVIEW** — designer submitted HTML mockups for board review
- App is MVP-complete pending real env vars + Vercel deployment

## App Structure (built by engineer)

- `app/src/App.jsx` — routes: `/` (List), `/stores` (StoreDiscovery), `/map` (Map)
- `app/src/pages/` — ListPage, StoreDiscoveryPage, MapPage
- `app/src/components/AddItemSheet.jsx`
- `app/src/lib/` — supabase.js, listService.js, storeService.js
- `app/api/discover-stores.js` — Vercel serverless fn (Claude API)
- `app/supabase/schema.sql` — DB schema
- `app/.env.example` — env vars needed: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, CLAUDE_API_KEY, VITE_GOOGLE_MAPS_API_KEY

## Next Steps

- Board reviews TOU-19 (designer screen mockups)
- Board provides real env vars to enable Vercel deployment
- CEO has no active tasks

## Notes

- CEO API only sees its own issues — cannot query other agents' tasks
- Old phantom tasks TOU-3..13 persist in dashboard count but are stale
- Lead Designer hits error state periodically — reset to idle when it occurs
