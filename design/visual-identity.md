# Visual Identity — Tourist Shopping List App
**Version:** 1.0 | **Date:** March 2026 | **Status:** In Review

> Rendered HTML preview: `/design/visual-identity.html` (open in browser for true colour/font rendering)

---

## 1. Colour System

### 1.1 Primary — Tokyoite Blue

The single primary colour family. Inspired by Tokyo's transit system and night skyline — modern, trustworthy, and highly legible on map backgrounds.

| Step | Hex       | Usage                                              |
|------|-----------|----------------------------------------------------|
| 50   | `#EBF1FF` | Tinted backgrounds, hover states                   |
| 100  | `#D6E4FF` | Selected list items, subtle fills                  |
| 200  | `#ACC9FF` | Disabled button fill, progress indicators          |
| 300  | `#74A7FF` | Secondary links, icon fills                        |
| 400  | `#3D81FF` | Hover state for primary button                     |
| **500** ★ | **`#1B5FE8`** | **Primary brand colour. Buttons, links, active states** |
| 600  | `#1249C7` | Pressed state for primary button                   |
| 700  | `#0C35A0` | Body text on light backgrounds (WCAG AA)           |
| 800  | `#082480` | Heading text, dark UI elements (WCAG AAA 12:1)     |
| 900  | `#041561` | Near-black blue for display text                   |

**Contrast ratios (Blue-500 on white):** 5.97:1 → passes WCAG AA ✓
**Blue-800 on white:** ~12:1 → passes WCAG AAA ✓ (use for body text outdoors)

---

### 1.2 Accent — Neon Tangerine

Reserved for the single most important action per screen. Never use for decoration.

| Step | Hex       | Usage                                         |
|------|-----------|-----------------------------------------------|
| 300  | `#FFB08A` | Background tints                              |
| 400  | `#FF894A` | Hover state                                   |
| **500** ★ | **`#FF6B2B`** | **FAB (Add Item), map chips, key CTAs**   |
| 600  | `#E04E12` | Pressed state                                 |

---

### 1.3 Success — Jade

Used exclusively for purchased/completed states. Distinct from blue and tangerine.

| Step | Hex       | Usage                                      |
|------|-----------|--------------------------------------------|
| 300  | `#4DDFC9` | Background tint for completion states      |
| 400  | `#00C8A8` | Progress bars                              |
| **500** ★ | **`#00B896`** | **"Mark as bought" button, success toast** |
| 600  | `#008D73` | Pressed state, darker text on jade bg      |

---

### 1.4 Semantic Colours

| Name    | Hex       | Context                                    |
|---------|-----------|--------------------------------------------|
| Error   | `#E8394D` | Form errors, store not found               |
| Warning | `#F5A623` | Item may be hard to find, stock caveat     |
| Success | `#00B896` | Purchased confirmation (= Jade-500)        |
| Info    | `#1B5FE8` | System messages (= Blue-500)               |

---

### 1.5 Neutral — Cool Gray

Slight cool/blue cast to harmonise with the primary palette.

| Step | Hex       | Common usage                              |
|------|-----------|-------------------------------------------|
| 50   | `#F8F9FC` | App background                            |
| 100  | `#F0F2F8` | Card backgrounds, dividers                |
| 200  | `#E1E4EF` | Borders, divider lines                    |
| 300  | `#C8CCE0` | Placeholder borders                       |
| 400  | `#9EA4C1` | Placeholder text, disabled icons          |
| 500  | `#7178A0` | Secondary/caption text                    |
| 600  | `#545B85` | Subheading text, inactive nav items       |
| 700  | `#3B4168` | Body text (supporting)                    |
| 800  | `#27304E` | Body text (primary on light bg)           |
| 900  | `#161C34` | Near-black. Display text, icon fills      |

---

### 1.6 Map Pin Colour Coding

Each shopping list item is assigned a category colour automatically. This colour is **persistent** — it appears on the list item, the map pin, and the store card.

| Category          | Hex       | Rationale                                         |
|-------------------|-----------|---------------------------------------------------|
| Electronics       | `#1B5FE8` | Primary blue — most common MVP use case           |
| Food & Snacks     | `#FF6B2B` | Tangerine — appetite/food associations            |
| Clothing          | `#A855F7` | Purple — fashion/style                            |
| Souvenirs         | `#EAB308` | Amber/gold — treasure, gift                       |
| Beauty & Health   | `#EC4899` | Pink — widely recognised for beauty category      |
| Books & Stationery| `#22C55E` | Green — calm, knowledge                           |
| **Multi-item store** | `#161C34` | **Dark navy — dominant, signals high value**      |

**Multi-item store pins** are 20% larger than single-item pins and display a white numeric badge. These stores carry 2+ items from the list and should be the most visually prominent elements on the map.

---

## 2. Typography

### 2.1 Font Families

**Maximum 2 fonts.**

| Font              | Role                    | Weights      | Source      |
|-------------------|-------------------------|--------------|-------------|
| Plus Jakarta Sans | Display, H1, H2         | 700, 800     | Google Fonts |
| Inter             | H3, Body, Labels, UI    | 400, 500, 600| Google Fonts |

**Why these two:**
- Plus Jakarta Sans has strong geometric personality at large sizes. Legible, modern, and distinctive without being quirky.
- Inter is the gold standard for mobile UI legibility — specifically designed for screen at small sizes.

---

### 2.2 Type Scale — Mobile (375px baseline)

| Name         | Size | Line-height | Font             | Weight | Letter-spacing |
|--------------|------|-------------|------------------|--------|----------------|
| Display      | 28px | 36px        | Plus Jakarta Sans | 800    | -0.01em        |
| Heading 1    | 24px | 32px        | Plus Jakarta Sans | 700    | -0.01em        |
| Heading 2    | 20px | 28px        | Plus Jakarta Sans | 700    | 0              |
| Heading 3    | 17px | 24px        | Inter             | 600    | 0              |
| Body Large   | 16px | 24px        | Inter             | 400    | 0              |
| Body         | 15px | 22px        | Inter             | 400    | 0              |
| Small        | 13px | 20px        | Inter             | 400    | 0              |
| Caption      | 12px | 18px        | Inter             | 400    | 0              |
| Label/Allcaps| 11px | 16px        | Inter             | 600    | 0.08em         |

**Minimum text size:** 12px. Never go below this — tourists in outdoor glare conditions need legible text.

**Tablet scaling (768px+):** Display → 36px, H1 → 28px, H2 → 24px. All other sizes unchanged.

---

## 3. Iconography

### 3.1 Map Pins

Teardrop shape (standard map pin). Category-coloured fill, white icon inside, subtle inner glow overlay.

```
Shape:   Classic teardrop, 36px wide × 48px tall (single), 44×56px (multi)
Fill:    Category colour (see 1.6)
Inner:   20% white overlay circle for depth
Icon:    White, 14px, centred within the pin head

Multi-item pin:
  - Size: 44×56px (20% larger)
  - Fill: #161C34 (Dark navy)
  - Badge: White numeral (count of matching items), Inter 800, 15px
  - Drop shadow: 0 4px 10px rgba(0,0,0,0.22)

Purchased pin:
  - Fill: Jade-500 (#00B896)
  - Icon: White checkmark
  - Opacity: 60% (de-emphasised once bought)
```

**Category icons within pins:**

| Category          | Icon concept                     |
|-------------------|----------------------------------|
| Electronics       | Lightning bolt                   |
| Food & Snacks     | Fork/bowl                        |
| Clothing          | Hanger                           |
| Souvenirs         | Star                             |
| Beauty & Health   | Flower / radial sparkle          |
| Books & Stationery| Stacked rectangles (book spines) |
| Purchased         | Checkmark                        |

---

### 3.2 Action Icons

**Style:** Outline, 2px stroke, rounded linecap/linejoin. Feather icon library is the recommended source.
**Active state:** Filled version of the same icon, no stroke.
**Sizes:** 20px (inline text), 24px (standard UI), 32px (feature/hero).

| Icon          | Action                         |
|---------------|--------------------------------|
| Plus circle   | Add item to list               |
| Checkmark     | Mark as purchased              |
| Search        | Search / discover              |
| Map pin       | Switch to map view             |
| List          | Switch to list view            |
| Trash         | Remove item                    |
| Sliders       | Filter                         |
| Clock         | Store hours                    |
| Send / arrow  | Navigate (opens Google Maps)   |
| Person        | "For (name)" item assignment   |
| Dollar/¥      | Budget                         |
| Wifi/signal   | AI discover stores             |
| Pencil        | Edit item                      |
| Tag           | Category                       |

**Touch target rule:** Minimum 44×44px for all tappable elements. Pad with invisible area — never shrink the icon itself to hit 44px.

**Never icon-only** on primary actions. Always pair with a text label. Icon-only is acceptable only for secondary toolbar items where context makes the action immediately obvious.

---

## 4. Spacing System

Base-4 system. All spacing values are multiples of 4px.

| Token | Value | Usage                                              |
|-------|-------|----------------------------------------------------|
| xs    | 4px   | Icon-to-label gap, inner list item spacing         |
| sm    | 8px   | Chip padding, small element gaps                   |
| —     | 12px  | Card internal padding (tight)                      |
| base  | 16px  | Screen edge padding, card padding (standard)       |
| —     | 20px  | Section gaps within a card                         |
| lg    | 24px  | Section separators, large card padding             |
| xl    | 32px  | Between major sections                             |
| —     | 40px  | Large section breaks                               |
| 2xl   | 48px  | Button height (primary), top-section spacing       |
| 3xl   | 64px  | Page-level section breaks                          |

**Key layout rules:**
- Screen horizontal padding: 16px at 375px
- Bottom sheet collapsed height: 80px
- Bottom sheet expanded: 70% viewport height
- Bottom navigation bar: 56px tall
- Map area (collapsed state): full screen minus 80px bottom sheet
- Card border-radius: 14–20px (larger = more friendly/approachable)

---

## 5. Border Radius

| Element          | Radius |
|------------------|--------|
| Primary button   | 12px   |
| Card / sheet     | 20px   |
| Input field      | 10px   |
| Chip / tag       | 20px (fully rounded) |
| Icon button      | 12px   |
| Map pin          | N/A (custom shape) |
| Bottom sheet     | 20px top corners, 0 bottom |

---

## 6. Design Principles

1. **Outdoor first.** All text meets WCAG AA (4.5:1) minimum. Body text targets AAA (7:1). Tested against bright sunlight simulation.

2. **375px baseline.** Every decision starts here. One-handed use is the assumed default.

3. **Map is the hero.** 60–70% of screen real estate is the map. UI overlays as bottom sheets and floating chips — it never competes.

4. **Language-agnostic.** Icons over labels wherever possible. No idioms, no locale-specific UX copy in interface chrome.

5. **Colour codes items.** Each list item has a persistent category colour — list, pin, and store card all share it. This visual vocabulary is learnable in under 30 seconds.

6. **Progress is satisfying.** Purchasing is the primary goal. The UI celebrates it: jade colour, checkmark, strikethrough, pin dims. Do not understate success.

---

## 7. Do / Don't

| Do                                              | Don't                                              |
|-------------------------------------------------|----------------------------------------------------|
| Use Blue-500 for a single primary action        | Use Blue-500 AND Tangerine-500 on the same button row |
| Keep map pins small and distinct                | Add text labels to map pins (illegible at map scale) |
| Use Plus Jakarta Sans for display/headings only | Use Plus Jakarta Sans for body copy                |
| Pair every icon with a label on primary actions | Use icon-only buttons for primary/critical actions |
| Use Jade for purchased/done state               | Use any other colour for the "purchased" state     |
| Meet 44px touch target minimum always           | Shrink touch targets below 44px for visual reasons |

---

*For the rendered version with real colours, fonts, and components, open `/design/visual-identity.html` in a browser.*
