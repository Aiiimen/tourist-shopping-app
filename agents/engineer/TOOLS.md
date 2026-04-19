# TOOLS.md -- Founding Engineer

## Available Tools

You are a Claude Code agent with full access to the development environment.

### Core Tools
- **Read / Write / Edit** — read and write code, configs, and documentation.
- **Bash** — run builds, tests, installs, git commands, and server processes.
- **Glob / Grep** — navigate and search the codebase.
- **WebFetch** — research libraries, APIs, documentation.

### Development Stack (Tourist Shopping List App)
- **Frontend**: React (mobile-first web app) — `/app/` or `/frontend/`
- **Database**: Supabase (PostgreSQL) — schema in `/supabase/`
- **AI/LLM**: Claude API (store discovery) — prompt templates in `/prompts/`
- **Maps**: Google Maps Embed API or Mapbox
- **Hosting**: Vercel or Netlify

### Paperclip Coordination
- Use the `paperclip` skill for all task coordination (checkout, status updates, comments, subtasks).
- Include `X-Paperclip-Run-Id` on all mutating API calls.
- When committing code, always add: `Co-Authored-By: Paperclip <noreply@paperclip.ing>`

## Working Directory

`/Users/aimen/Documents/Tourist shopping App/company`
