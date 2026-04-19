# Wireframes Overview — Tourist Shopping List App MVP
**TOU-7** | Version 1.0 | March 2026

---

## The 3 Core Screens

| Screen | File | Purpose |
|--------|------|---------|
| 1. List Creation | `01-list-creation.md` | Build shopping list, trigger store discovery |
| 2. Store Discovery | `02-store-discovery.md` | Review matched stores per item |
| 3. Map | `03-map.md` | Locate stores on map, mark items bought |

---

## User Flow

```
  ┌─────────────────┐
  │                 │
  │  LIST CREATION  │ ──── FAB tap → bottom sheet → "Add to List"
  │  (entry point)  │           ↓
  └────────┬────────┘     Discovery runs async
           │              (Claude API → Supabase cache)
           │ "View on Map" OR nav "Map"
           ↓
  ┌─────────────────┐
  │                 │
  │ STORE DISCOVERY │ ──── [Map →] on any store
  │  (optional step)│
  └────────┬────────┘
           │ "See All on Map"
           ↓
  ┌─────────────────┐
  │                 │
  │      MAP        │ ──── Pin tap → store card → "Mark bought"
  │  (destination)  │      "Directions" → native Maps app
  │                 │
  └─────────────────┘
```

**Navigation shortcuts:**
- Bottom nav bar appears on all 3 screens (List | Map icons)
- Map screen's bottom sheet gives direct access to full list without leaving map

---

## Design Principles Applied

- **Map-first** — every screen has a primary CTA pointing to the map
- **One FAB per screen** — primary action is always Tangerine (#FF6B2B), never ambiguous
- **Persistent colour coding** — category colours from the list carry through to map pins
- **Tourist constraints** — large tap targets (min 44px), high contrast, minimal text entry
- **Progressive disclosure** — Store Discovery is optional; List → Map is the minimal path

---

## Visual Identity Reference

All colours, typography, and pin specs are defined in:
- `/design/visual-identity.html` (rendered, open in browser)
- `/design/visual-identity.md` (spec document)
