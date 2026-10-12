# ADR-0008: Paperlike Color Palette & HeroUI v3 Design Tokens

- **Status**: Accepted
- **Date**: 2026-09-22
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context

Ticket #11 investigated the official visual design identity for the personal finance application.
Initial prototypes compared multiple design themes (Corporate Clean, FinTech Dark, Minimalist Scandinavian, Neo-Brutalist, and Paperlike).
Following review and evaluation, the maintainer locked **Paperlike** as the official visual identity for the application.

Screen-specific layouts, dashboards, and detailed interaction flows are intentionally deferred to dedicated feature prototypes (e.g. Transactions, Budgets, Wallets). This ADR governs strictly the **color palette, typography pairings, and design token integration with HeroUI v3 and Tailwind CSS v4**.

---

## 2. Design Aesthetic: Paperlike

The Paperlike design language evokes the tactile, deliberate, and calming experience of a physical accounting ledger or Moleskine notebook. In personal finance, digital interfaces often induce cognitive anxiety with loud neon colors and generic SaaS patterns. Paperlike replaces high-glare stark whites with warm unbleached parchment tones, stark pure blacks with charcoal graphite ink, and digital alerts with archival ink stamps.

### Core Visual Principles

1. **Warm Canvas & Paper Surfaces**: Gentle off-white/cream tones (`#FAF6EE` canvas, `#FFFDF9` card sheets) that eliminate screen glare.
2. **Archival Ink Hierarchy**: Charcoal ink (`#26221F`) for high contrast readability; warm graphite (`#6E665E`) for secondary ledger markings and metadata.
3. **Fountain Pen & Stamp Semantics**:
   - Primary Action / Focus: Deep Prussian Blue (`#1E3A8A`).
   - Positive / Inflow: Fountain Pen Evergreen (`#166534`).
   - Alert / Outflow: Carmine Stamp Red (`#991B1B`).
   - Warning / Threshold: Warm Ochre Amber (`#B45309`).
   - Sticky Note Accent: Soft Pastel Post-It (`#FEF9C3`).
4. **Editorial & Tabular Typography**:
   - Serif (`Newsreader` / `Georgia`) for headings, brand identity, and financial narratives.
   - Tabular Monospace (`JetBrains Mono`) for financial figures, currency amounts, and timestamps.
   - Clean Sans-Serif (`Inter`) for crisp micro-labels, navigation links, and compact form fields.
5. **Subtle Tactility**:
   - Gently softened corners (`--radius: 0.375rem` / `6px`) mirroring cut notebook sheets.
   - Warm ledger divider rulings (`--border: #E8DFC8`).

---

## 3. HeroUI v3 Semantic Token Mapping

HeroUI v3 runs natively on Tailwind CSS v4 using CSS variables and semantic design tokens (`background`, `foreground`, `surface`, `field`, `accent`, etc.).

### Light Mode (`[data-theme="light"]`, `.light`)

| HeroUI Semantic Token  | Hex / Value | Semantic Role in Paperlike                       |
| :--------------------- | :---------- | :----------------------------------------------- |
| `--background`         | `#FAF6EE`   | Canvas desk / open journal background            |
| `--foreground`         | `#26221F`   | Deep charcoal graphite ink (Primary text)        |
| `--surface`            | `#FFFDF9`   | Clean paper sheet (Cards, primary containers)    |
| `--surface-foreground` | `#26221F`   | Text on paper sheets                             |
| `--surface-secondary`  | `#F4EFE4`   | Shaded paper block / ledger section headers      |
| `--surface-tertiary`   | `#EFE8D8`   | Chip backgrounds, active tabs, subtle highlights |
| `--overlay`            | `#FFFDF9`   | Modals, popovers, dropdown menus                 |
| `--overlay-foreground` | `#26221F`   | Text on overlays                                 |
| `--muted`              | `#6E665E`   | Secondary graphite pencil notes, timestamps      |
| `--border`             | `#E8DFC8`   | Ledger ruling lines, card borders                |
| `--separator`          | `#E8DFC8`   | Table divider lines, dividers                    |
| `--default`            | `#F4EFE4`   | Neutral buttons, pill chips                      |
| `--default-foreground` | `#26221F`   | Text on neutral elements                         |
| `--accent`             | `#1E3A8A`   | Fountain pen blue (Primary CTA buttons, links)   |
| `--accent-foreground`  | `#FFFFFF`   | High-contrast white text on blue CTA             |
| `--success`            | `#166534`   | Archival stamp green (Income, positive delta)    |
| `--success-foreground` | `#FFFFFF`   | Text on green badges                             |
| `--warning`            | `#B45309`   | Pencil ochre amber (Budget warning)              |
| `--warning-foreground` | `#FFFFFF`   | Text on warning badges                           |
| `--danger`             | `#991B1B`   | Carmine red seal (Expenses, critical alerts)     |
| `--danger-foreground`  | `#FFFFFF`   | Text on danger badges                            |
| `--field-background`   | `#FFFDF9`   | Input / Select background                        |
| `--field-foreground`   | `#26221F`   | Input text color                                 |
| `--field-border`       | `#E8DFC8`   | Input border ruling                              |
| `--post-it`            | `#FEF9C3`   | Sticky note yellow accent                        |
| `--post-it-foreground` | `#713F12`   | Dark brown ink on sticky notes                   |
| `--radius`             | `0.375rem`  | Soft paper cut border radius (6px)               |

### Dark Mode (`[data-theme="dark"]`, `.dark`)

| HeroUI Semantic Token  | Hex / Value | Semantic Role in Paperlike Dark             |
| :--------------------- | :---------- | :------------------------------------------ |
| `--background`         | `#1C1917`   | Archival notebook leather cover (Stone 900) |
| `--foreground`         | `#F5F0E6`   | Warm parchment ink text                     |
| `--surface`            | `#292524`   | Elevated leather panel (Stone 800)          |
| `--surface-foreground` | `#F5F0E6`   | Text on dark surface                        |
| `--surface-secondary`  | `#332E2B`   | Secondary panel (Stone 750)                 |
| `--surface-tertiary`   | `#3E3834`   | Tertiary tabs / hovered elements            |
| `--overlay`            | `#292524`   | Modals and dropdowns in dark mode           |
| `--muted`              | `#A8A29E`   | Dimmed graphite notes (Stone 400)           |
| `--border`             | `#44403C`   | Subtle dark ruling lines (Stone 700)        |
| `--accent`             | `#60A5FA`   | Soft luminous fountain pen blue             |
| `--accent-foreground`  | `#0F172A`   | Dark text on bright blue CTA                |
| `--success`            | `#4ADE80`   | Muted emerald green                         |
| `--warning`            | `#FBBF24`   | Warm luminous amber                         |
| `--danger`             | `#F87171`   | Soft carmine red                            |
| `--field-background`   | `#292524`   | Input surface in dark mode                  |
| `--field-border`       | `#44403C`   | Input border ruling in dark mode            |

---

## 4. Consequences

### Positive

- Unified design tokens across all components (HeroUI buttons, inputs, cards, tables).
- Eliminates visual fatigue through warm color temperatures and high-legibility contrasts (all text pairings satisfy WCAG 2.1 AA contrast > 4.5:1).
- Clear separation between visual foundation (colors/tokens) and functional screens (layouts deferred to feature-specific tickets).
- Zero reliance on rejected UI gimmicks (such as fixed 2-tap preset amount chips).

### Implementation Checklist

1. Import `@heroui/styles` in `frontend/src/app/globals.css`.
2. Define CSS variables for `:root`, `[data-theme="light"]`, and `.dark`, `[data-theme="dark"]`.
3. Bridge semantic variables into Tailwind v4 via `@theme inline`.
4. Keep `prototype/design-system-showcase.html` as the interactive swatch and typography viewer.
