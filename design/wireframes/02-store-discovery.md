# Wireframe: Store Discovery Results Screen
**TOU-7** | Mobile (375px) | Version 1.0

---

## Purpose
After item entry, the app uses the Claude API to find Tokyo stores. This screen presents those results as a scannable list so tourists can make purchase decisions before opening the map. It bridges List Creation → Map.

---

## Layout — 375px (Results loaded)

```
┌─────────────────────────────────┐  ← Status bar
│ 9:41                   ●●● 📶  │
├─────────────────────────────────┤
│                                 │  ← Header (56px)
│  ←    Stores Found              │    Back: returns to List
│              3 of 8 found  ✓   │    Right: count summary
├─────────────────────────────────┤
│                                 │
│  [All] [Not found] [Bought ✓]  │  ← Filter chips (horizontal scroll)
│                                 │    Active chip: Blue-500 fill, white text
│                                 │    Inactive: Gray-100 bg, Gray-700 text
├─────────────────────────────────┤
│                                 │
│  ● SONY WH-1000XM5              │  ← Item group header (16px, Blue dot)
│    Electronics · ¥35,000        │    H3 / Gray-900, Small / Gray-500
│                                 │
│  ┌─────────────────────────────┐│  ← Store card
│  │ Yodobashi Camera Akihabara  ││    Primary store (best match)
│  │ ★★★★½  ·  0.8km            ││    Rating: Small / Amber
│  │ 1-chome, Sotokanda, Chiyoda ││    Distance: Small / Gray-500
│  │ Open now · Closes 22:00     ││    Hours: Small / Jade-500 (open)
│  │                      [Map →]││    Map link → highlight pin on map
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ BIC CAMERA Yurakucho        ││
│  │ ★★★★   ·  2.1km            ││
│  │ 1-11-1 Yurakucho, Chiyoda  ││
│  │ Open now · Closes 21:00     ││
│  │                      [Map →]││
│  └─────────────────────────────┘│
│                                 │
│  ──────────────────────────────  │  ← Divider between item groups
│                                 │
│  ● MATCHA KIT KAT               │  ← Item group header (orange dot)
│    Food & Snacks · ¥1,200       │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Don Quijote Shinjuku        ││  ← Multi-item store (dark navy dot)
│  │ ★★★★   ·  1.4km            ││    Carries 3 items from your list
│  │ 1-16-5 Kabukicho, Shinjuku  ││
│  │ Open 24h                    ││
│  │ ★ Also sells 2 other items  ││  ← Multi-item flag (italic, Blue-500)
│  │                      [Map →]││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 7-Eleven (Shinjuku 3-chome) ││
│  │ ★★★    ·  0.3km            ││
│  │ 3-32 Shinjuku, Shinjuku     ││
│  │ Open 24h                    ││
│  │                      [Map →]││
│  └─────────────────────────────┘│
│                                 │
│  ──────────────────────────────  │
│                                 │
│  ● UNIQLO HEATTECH SOCKS        │  ← Purple dot (clothing)
│    Clothing · ¥1,500            │
│                                 │
│  ┌─────────────────────────────┐│
│  │ UNIQLO Ginza                ││
│  │ ★★★★½  ·  1.9km            ││
│  │ 6-9-5 Ginza, Chuo           ││
│  │ Open now · Closes 21:00     ││
│  │ ★ Also sells 1 other item   ││
│  │                      [Map →]││
│  └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│                                 │  ← Fixed bottom CTA
│  ┌─────────────────────────────┐│
│  │  🗺  See All on Map         ││  ← Blue-500 fill, full width
│  └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│   📋 List    🗺 Map    ⚙        │
└─────────────────────────────────┘
```

---

## Layout — Loading State

```
┌─────────────────────────────────┐
│ ←    Finding Stores…            │
│              0 of 8 found       │
├─────────────────────────────────┤
│                                 │
│  ● SONY WH-1000XM5              │
│    Electronics · ¥35,000        │
│                                 │
│  ┌─────────────────────────────┐│  ← Skeleton card (Gray-100 animated shimmer)
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │░░░░░░░░░░  ·  ░░░░          ││
│  │░░░░░░░░░░░░░░░░░░░░         ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │░░░░░░░░░░  ·  ░░░░          ││
│  └─────────────────────────────┘│
│                                 │
│  ──────────────────────────────  │
│  ● MATCHA KIT KAT [searching…]  │  ← Spinner next to item name
│                                 │
└─────────────────────────────────┘
```

---

## Store Card — Full Detail

```
┌───────────────────────────────────┐
│  Store Name (truncated if long)   │  Body / Gray-900 / 16px
│  ★★★★½ · X.Xkm                   │  Stars: Amber / distance: Gray-500
│  Full address line                │  Caption / Gray-400
│  Open now · Closes HH:MM  OR 24h │  Jade-500 (open) / Error-500 (closed)
│  ★ Also carries N other items     │  Blue-500 italic (multi-item indicator)
│                          [Map →]  │  Inline link: Blue-500, right-aligned
└───────────────────────────────────┘

Padding: 16px all sides
Border radius: 12px
Background: white
Shadow: 0 1px 4px rgba(0,0,0,0.08)
Min height: 80px
```

---

## Item Group Header

```
  ● ITEM NAME (CAPS)        [Mark bought ✓]
    Category · ¥Budget
```

- Category dot: 12px circle in category colour
- Item name: Label/Allcaps (11px, 0.08em tracking) / Gray-900
- "Mark bought" button: appears inline right when stores found (Jade-500, small)
- When purchased: entire group gets 60% opacity, strikethrough on name, "Bought ✓" replaces button

---

## Filter Chips

```
  [All ▾]  [Not found (2)]  [Bought ✓ (3)]  [Filter by item ▾]
```

- Horizontal scroll (no pagination)
- "All": always first
- Count in brackets when non-zero
- "Filter by item" opens a dropdown/sheet to isolate one item's stores

---

## "Not Found" State (per item)

```
│  ● RARE VINTAGE ITEM            │
│    Category · Budget            │
│                                 │
│  ┌─────────────────────────────┐│
│  │  😕  No stores found nearby ││  ← Icon + message
│  │  This item may be rare or   ││
│  │  need a specialist shop.    ││
│  │  [Search differently ↗]     ││  ← Optional: open web search
│  └─────────────────────────────┘│
```

---

## Interaction Notes

| Trigger | Action |
|---------|--------|
| Filter chip tap | Filter list to matching status |
| Store card tap | Expand to see full address + hours detail |
| [Map →] tap | Open Map screen, fly to that store's pin |
| "See All on Map" button | Open Map screen with all pins visible |
| "Mark bought ✓" tap | Mark item purchased → cards fade, item badge updates in list |
| Multi-item store row | Tap to see which other items this store carries |
| Back arrow | Return to List Creation screen |

---

## Key Design Decisions

1. **Grouped by item, not by store** — tourists think "I need X, where do I find it?" not "let me visit one store". Grouping by item maps to mental model.
2. **Multi-item stores surfaced per-item** — a store carrying 3 items appears in each relevant group with a "★ Also carries N items" tag. Tourist can spot consolidation opportunities without switching screens.
3. **Distance is always visible** — fatigue and time pressure are real. Distance drives store choice as much as rating.
4. **Hours shown inline** — no extra tap needed. "Open 24h" reduces tourist anxiety about timing.
5. **"See All on Map" is the primary CTA** — this screen is a stepping stone. The destination is always the map.
6. **Skeleton loading, not spinner** — keeps layout stable, reduces layout shift anxiety.
