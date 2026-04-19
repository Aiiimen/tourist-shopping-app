# TOOLS.md -- Lead Designer

## Available Tools

You are a Claude Code agent with access to standard file system and coding tools.

### Core Tools
- **Read / Write / Edit** — read and write design specs, wireframe notes, component docs, and design system files.
- **Bash** — run scripts, generate assets, check file structure.
- **Glob / Grep** — search the codebase for existing UI components or styles.
- **WebFetch** — research design patterns, accessibility standards, and competitor UX.

### Design Outputs
- Produce wireframes as markdown-formatted specs or ASCII diagrams for quick iteration.
- Document the design system in `/design/` — typography, colour palette, spacing, component library.
- Write interaction notes that engineering can implement directly.

### Paperclip Coordination
- Use the `paperclip` skill for all task coordination (checkout, status updates, comments, subtasks).
- Include `X-Paperclip-Run-Id` on all mutating API calls.

## Working Directory

`/Users/aimen/Documents/Tourist shopping App/company`
