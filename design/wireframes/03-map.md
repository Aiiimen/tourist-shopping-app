# Wireframe: Map Screen
**TOU-7** | Mobile (375px) | Version 1.0

---

## Purpose
The hero screen. The map gives tourists spatial context — where to go, what to buy there, and what's left. Everything in this app serves to get the tourist to this screen and keep them oriented.

---

## Layout — Default (map full-screen, bottom sheet collapsed)

```
┌─────────────────────────────────┐  ← Status bar (translucent over map)
│ 9:41                   ●●● 📶  │
├─────────────────────────────────┤
│                                 │
│  ←                    [≡ List] │  ← Floating top bar (white, shadow, 56px)
│     Tokyo Shopping Map          │    Back: returns to List
│                                 │    ≡ List: opens item filter sheet
├─────────────────────────────────┤
│                                 │
│                                 │
│    [Map tiles — Google/Mapbox]  │
│                                 │
│         📍(navy,2)              │  ← Multi-item pin (Don Quijote)
│                                 │    Dark navy, 44×56px, badge "2"
│     📍(blue)  📍(orange)       │  ← Single-item pins (Electronics, Food)
│                                 │
│                                 │
│               📍(purple)       │  ← Clothing category pin
│                                 │
│                                 │
│         📍(jade,✓)             │  ← Purchased pin (faded, checkmark)
│                                 │
│                                 │
├─────────────────────────────────┤
│ ─── ─── ─── ─── ─── ─── ─── ── │  ← Bottom sheet handle (drag up)
├─────────────────────────────────┤
│                                 │
│  3 of 8 items found    4 left   │  ← Progress summary (H3 / Gray-900)
│  ████████████░░░░░░░░░          │    Progress bar (Blue-500)
│                                 │
│  [Sony ●]  [Kit Kat ●]  [+5 ▾] │  ← Item filter chips (horizontal scroll)
│                                 │    Tapping isolates that item's pins
│                                 │
│  ┌─────────────────────────────┐│  ← Active store card (appears on pin tap)
│  │ Don Quijote Shinjuku        ││    See "Store Detail Card" below
│  │ Carries 3 items · 1.4km    ││
│  │ Open 24h                    ││
│  │ [✓ Mark bought] [Map →]    ││
│  └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘
```

```
              ← Floating map controls (right side, 44×44px each)
                        ┌──┐
                        │⊕ │  ← Zoom in
                        └──┘
                        ┌──┐
                        │⊖ │  ← Zoom out
                        └──┘
                        ┌──┐
                        │◎ │  ← My location (re-centre)
                        └──┘
         Position: fixed, right 12px, bottom 180px
         Background: white, shadow, radius 8px
```

---

## Bottom Sheet — Collapsed (default)

```
┌─────────────────────────────────┐  ← Sheet peek: 120px visible
│ ─── ─── ─── ─── ─── ─── ─── ── │    Pill handle: 4×32px Gray-300
├─────────────────────────────────┤
│  3 of 8 items found    4 left   │
│  ████████████░░░░░░░░░          │  ← Progress bar
│                                 │
│  [All ●] [Sony ●] [Kit Kat ●]  │  ← Filter chips (horizontal scroll)
└─────────────────────────────────┘
```

---

## Bottom Sheet — Half-expanded (drag up to 50vh)

```
┌─────────────────────────────────┐
│             (map visible)       │
│                                 │
├────────── Sheet ────────────────┤
│ ─── ─── ─── ─── ─── ─── ─── ── │
│                                 │
│  SHOPPING LIST                  │  ← Section label (Allcaps 11px)
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ●  Sony WH-1000XM5          │ │  ← Item row: compact (40px)
│ │    2 stores · 0.8km away    │ │    Tap: re-centre map on nearest store
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ●  Matcha Kit Kat           │ │
│ │    3 stores · 0.3km away    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ✓  Tokyo Banana             │ │  ← Purchased: Jade dot, strikethrough
│ │    ~~Bought at Don Quijote~~ │ │
│ └─────────────────────────────┘ │
│                                 │
│  + Add another item             │  ← Ghost/text CTA (Blue-500)
│                                 │
└─────────────────────────────────┘
```

---

## Bottom Sheet — Full-expanded (drag to 90vh, map mostly hidden)

```
┌─────────────────────────────────┐  ← 10% map visible at top (decorative)
│                         [✕ Map] │    Close button: Gray-500, right
├─────────────────────────────────┤
│ SHOPPING LIST                   │
│                                 │
│ [All] [To find] [Bought ✓]     │  ← Filter chips (full list mode)
│                                 │
│ ── To find (5) ─────────────── │  ← Section divider
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ●  Sony WH-1000XM5          │ │
│ │    Yodobashi · 0.8km        │ │
│ │    Electronics · ¥35,000    │ │
│ │    For: Me                  │ │  ← Full detail card
│ │    [View stores] [→ Pin]    │ │    "→ Pin": flies to map pin
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ●  Matcha Kit Kat           │ │
│ │    Don Quijote · 0.3km      │ │
│ │    Food · ¥1,200  For: Mom  │ │
│ │    [View stores] [→ Pin]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ── Bought (3) ─────────────── │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ✓  ~~Tokyo Banana~~  [Jade] │ │  ← Purchased state
│ │    Bought at Don Quijote    │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## Map Pin — All States

```
SINGLE ITEM PIN (36×48px):
       ╭───╮
       │ ⚡ │  ← Category icon (white, 14px)
       │   │
       ╰─┬─╯  ← Point at bottom
         │
  Fill: Category colour (see Visual Identity 1.6)
  Inner: 20% white overlay circle
  Shadow: 0 2px 8px rgba(0,0,0,0.18)

MULTI-ITEM PIN (44×56px):
       ╭────╮
       │  2 │  ← White numeral (count), Inter 800, 15px
       │    │
       ╰──┬─╯
          │
  Fill: #161C34 (Dark navy)
  Badge: white text, larger pin size (20% bigger)
  Shadow: 0 4px 10px rgba(0,0,0,0.22)

SELECTED PIN (any type):
  Same as above + pulsing ring animation
  Ring: 3px, category colour, opacity 0.5, scale 1→1.5, loop

PURCHASED PIN:
       ╭───╮
       │ ✓ │  ← White checkmark
       │   │
       ╰─┬─╯
         │
  Fill: Jade-500 (#00B896)
  Opacity: 60% (de-emphasised)
  No shadow (recedes visually)
```

---

## Store Detail Card (appears at bottom when pin tapped)

```
┌───────────────────────────────────────┐  ← 16px horizontal margin
│  ●  Don Quijote Shinjuku             │  ← Colour dot (category / navy for multi)
│     1.4km away  ·  Open 24h          │    Distance / Hours (Small)
│                                       │
│  CARRIES FROM YOUR LIST:             │  ← Allcaps label
│  [Kit Kat ●] [Banana ●] [Heattech ●]│  ← Item chips (each in category colour)
│                                       │
│  1-16-5 Kabukicho, Shinjuku-ku        │  ← Full address (Caption / Gray-400)
│                                       │
│  [✓ Mark all bought]  [Directions ↗] │  ← Actions row
└───────────────────────────────────────┘
  Card height: ~160px
  Slide up from bottom on pin tap
  Dismiss: tap map, tap ✕, or drag down
```

**Single-item store card:**
```
┌───────────────────────────────────────┐
│  ●  Yodobashi Camera Akihabara        │
│     0.8km  ·  Open until 22:00        │
│                                       │
│  Sony WH-1000XM5 likely in stock      │  ← Item name + confidence text
│                                       │
│  1-chome Sotokanda, Chiyoda-ku        │
│                                       │
│  [✓ Mark bought]   [Directions ↗]    │
└───────────────────────────────────────┘
```

---

## Item Filter Chips (top of bottom sheet)

```
[All ●] [Sony ⚡] [Kit Kat 🍊] [Heattech 🟣] [+3 more ▾]
```

- Each chip shows item name + category colour dot
- Selecting a chip: all other category pins fade to 30% opacity, selected item's pins stay full colour
- "All" resets
- "+N more" opens a full list picker

---

## Map Cluster (many pins close together)

```
       ╭──────╮
       │  ●●● │  ← 3+ pins clustered: dark navy bg, white count
       │   5  │
       ╰──────╯
         Point
```

Tap: map zooms in to separate the cluster.

---

## Interaction Notes

| Trigger | Action |
|---------|--------|
| Pin tap | Store detail card slides up; pin pulses |
| Map tap (no pin) | Dismiss store card |
| Sheet handle drag | Expand / collapse bottom sheet (3 snap points) |
| Item chip in sheet | Filter: dim other pins, re-centre to filtered pins' bounds |
| "Mark bought" in card | Pin turns Jade; item updates in list; progress bar advances |
| "Mark all bought" | All chips in card update; all related pins turn Jade |
| "Directions" | Opens native Maps app (Google Maps / Apple Maps) with store address |
| "→ Pin" in list | Map re-centres to that item's nearest pin, closes sheet |
| Cluster tap | Zoom in |
| ◎ (My location) | Re-centre map on device location; show accuracy ring |
| ← Back | Return to previous screen (List or Store Discovery) |

---

## Key Design Decisions

1. **Map is full-screen, always** — no toolbar eating into map space. Floating controls only.
2. **Three-snap bottom sheet** — collapsed (120px: progress only), half (50vh: compact list), full (90vh: detailed list). Tourist decides how much list context they need without leaving the map.
3. **Filter chips dim rather than hide pins** — tourists may still want spatial context for un-selected items. Dimming to 30% keeps orientation without losing map clarity.
4. **Multi-item store is visually dominant** — dark navy + size + badge = tourist immediately spots the "best stop" without reading.
5. **Purchased pins stay on map (faded)** — gives tourists sense of progress and orientation ("I was there already").
6. **"Mark bought" reachable from pin card** — the act of purchasing happens at the store, phone in hand, so it must be one tap from the map pin, not buried in the list.
7. **Directions to native Maps** — we don't build navigation. Deep-link to Google/Apple Maps for turn-by-turn. Zero engineering for 100% reliability.
