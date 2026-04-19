# Wireframe: List Creation Screen
**TOU-7** | Mobile (375px) | Version 1.0

---

## Purpose
The entry point. Tourists build their shopping list before or during their trip. Simple, fast item entry with optional detail. The list acts as persistent state for the whole session.

---

## Layout — 375px

```
┌─────────────────────────────────┐  ← Status bar (system)
│ 9:41                   ●●● 📶  │
├─────────────────────────────────┤
│                                 │  ← Header (56px, #F8F9FC bg)
│  ←    My Shopping List          │    Back arrow (off: hidden on root)
│                                 │    Title: H2 / Plus Jakarta Sans 700
├─────────────────────────────────┤
│                                 │  ← Progress bar (4px, Blue-500 fill)
│  ████████░░░░░░░░░░░░░░░░░░░░   │    Shows: items found / total items
│  3 of 8 items found             │    Caption / Gray-500
├─────────────────────────────────┤
│                                 │
│  YOUR LIST                      │  ← Section label (ALLCAPS 11px / Gray-500)
│                                 │
│ ┌─────────────────────────────┐ │  ← Item card (radius 12px, white, shadow)
│ │ ●  Sony WH-1000XM5          │ │    ● = category colour dot (16px)
│ │    Electronics · ¥35,000    │ │    Title: Body / Gray-900
│ │    For: Me      [Found ✓]   │ │    Meta: Small / Gray-500
│ └─────────────────────────────┘ │    Found badge: Jade-500 bg, white text
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ●  Matcha Kit Kat (variety) │ │
│ │    Food · ¥1,200            │ │
│ │    For: Mom     [Found ✓]   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ●  Uniqlo Heattech socks    │ │
│ │    Clothing · ¥1,500        │ │
│ │    For: Everyone [Searching…]│ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │  ← Empty / skeleton state
│ │ ●  Tokyo Banana             │ │
│ │    Food · ¥800              │ │
│ │    For: Kids    [Searching…] │ │
│ └─────────────────────────────┘ │
│                                 │
│                                 │
│                                 │
│                                 │  ← Scrollable content area
│                                 │
│                                 │
├─────────────────────────────────┤
│                                 │  ← Bottom CTA (fixed, above nav)
│  ┌─────────────────────────┐    │    Map button: Primary / Blue-500 fill
│  │  🗺  View on Map        │    │    Full-width (16px margin each side)
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│                                 │  ← Bottom nav bar (56px, white bg)
│   📋 List    🗺 Map    ⚙ Settings │    Active: Blue-500, Inactive: Gray-400
│                                 │
└─────────────────────────────────┘
```

```
                                      ← FAB (Floating Action Button)
                          ┌────┐       Position: fixed, bottom 80px, right 16px
                          │ ＋ │       Size: 56×56px circle
                          └────┘       Fill: Tangerine-500 (#FF6B2B)
                                       Icon: white +, 24px
                                       Shadow: 0 4px 12px rgba(255,107,43,0.4)
```

---

## Add Item — Bottom Sheet

Triggered by tapping the FAB. Slides up from bottom. Overlay dims content (rgba 0,0,0, 0.4).

```
┌─────────────────────────────────┐
│                                 │  ← Dim overlay (tap to dismiss)
│          [List content]         │
│                                 │
├──────────┬──────────────────────┤  ← Sheet handle (40px drag zone)
│          │ ▬                    │    Pill handle: 4×32px, Gray-300, centred
├──────────┴──────────────────────┤
│                                 │  ← Sheet (radius 20px top corners)
│  Add Item                       │    Title: H2 / Gray-900
│                                 │
│  Item name *                    │  ← Required label (Label/Allcaps)
│  ┌─────────────────────────────┐│
│  │ e.g. Sony WH-1000XM5        ││  ← Text input (48px height)
│  └─────────────────────────────┘│    Placeholder: Gray-400
│                                 │    Border: Gray-200, focus: Blue-500 (2px)
│  Description  (optional)        │
│  ┌─────────────────────────────┐│
│  │ Any notes on colour/model…  ││  ← Textarea (72px height)
│  └─────────────────────────────┘│
│                                 │
│  Budget  (optional)             │
│  ┌─────────────┐  Currency      │
│  │  ¥          │  [JPY ▼]      │  ← Number input + currency selector
│  └─────────────┘               │    Currency: dropdown (JPY default)
│                                 │
│  For whom?  (optional)          │
│  ┌─────────────────────────────┐│
│  │ e.g. Me, Mom, Everyone       ││  ← Free text / short
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │   + Add to List             ││  ← Primary CTA: Blue-500 fill, 48px height
│  └─────────────────────────────┘│    Full width, rounded 12px
│                                 │
└─────────────────────────────────┘
```

---

## Item Card — Interaction States

```
DEFAULT:
┌───────────────────────────────────┐
│ ●  Item Name               [tag]  │  48px min height, 16px padding
│    Category · Budget              │  Tap: expand / go to store detail
│    For: [person]                  │
└───────────────────────────────────┘

EXPANDED (tap to reveal actions):
┌───────────────────────────────────┐
│ ●  Item Name               [tag]  │
│    Category · Budget              │
│    For: [person]                  │
│    ─────────────────────────────  │
│    [Edit]  [Remove]  [Found 3 →]  │  Action row: 44px tap targets
└───────────────────────────────────┘

PURCHASED:
┌───────────────────────────────────┐
│ ✓  ~~Item Name~~          [Bought]│  Strike-through text
│    Category · Budget              │  Pin and tag turn Jade-500
│    For: [person]                  │  Row opacity: 60%
└───────────────────────────────────┘
```

---

## Empty State

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         🛍                      │  ← Illustration placeholder (64px icon)
│                                 │
│    Your list is empty           │  H2 / Gray-900
│                                 │
│    Add items to find stores      │  Body / Gray-500
│    near you in Tokyo             │
│                                 │
│                                 │
└─────────────────────────────────┘
                                      + FAB visible (orange)
```

---

## Interaction Notes

| Trigger | Action |
|---------|--------|
| FAB tap | Open Add Item bottom sheet |
| Sheet drag down / overlay tap | Dismiss sheet |
| "Add to List" submit | Close sheet → new card appears at bottom of list → loading state begins (store discovery triggered async) |
| Item card tap | Expand for Edit / Remove / View Stores |
| "View on Map" button | Navigate to Map screen |
| Nav bar "Map" | Navigate to Map screen |
| Store discovery success | Card badge changes from "Searching…" to "Found ✓" with count |
| Store discovery failure | Card badge changes to "Not found" (Error-500 tint) |

---

## Key Design Decisions

1. **FAB not a top-bar button** — primary action (add item) is the only FAB. One per screen. Never two.
2. **Progress bar near top** — tourists need immediate feedback that something is happening (discovery running).
3. **"View on Map" fixed bottom** — the map is the destination. This CTA is always visible once ≥1 item exists.
4. **Category colour dot on each item** — persistent colour association starts here, carries to map pins.
5. **No keyboard-blocking fields** — bottom sheet ensures the keyboard doesn't obscure form fields (iOS/Android tested).
6. **"For whom" as free text** — avoid forcing dropdown choices. Tourists use it differently (self, family, colleagues, gift).
