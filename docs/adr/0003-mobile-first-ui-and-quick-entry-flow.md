# ADR-0003: Mobile-First UI Architecture and Quick Entry Flow

- **Status**: Accepted
- **Date**: 2026-09-21
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context
A personal finance application's adoption and data consistency hinge on the speed and ergonomics of logging daily expenses. Users frequently abandon manual tracking apps if recording a cup of coffee or meal requires more than 5 seconds or navigating nested screens. Furthermore, the home dashboard must provide instant situational awareness regarding net worth, liquidity across accounts, and category budget health.

---

## 2. Options Considered

Through prototype exploration (`prototype/mobile-entry-dashboard.html`), three interface archetypes were evaluated:
- **Variant A (Numpad Calculator-First)**: Emphasized a large bottom-sheet calculator with a stacked-card dashboard (Net worth card + horizontal accounts slider + category budget progress bars).
- **Variant B (Category-First & Preset Quick Taps)**: Emphasized a 2-tap entry flow (tap category icon -> enter amount with `+20k`, `+50k`, `+100k`, `+500k` preset chips) with a spending velocity speedometer.
- **Variant C (Timeline Stream & Docked Input)**: Chat-like transaction stream with a persistent input dock and net cashflow bar chart.

---

## 3. Decision
We adopt a **Hybrid Architecture (Variant A Dashboard + Variant B Quick Entry)**:

1. **Dashboard Architecture (from Variant A)**:
   - **Hero Card**: Net Worth indicator prominently displayed at the top.
   - **Account Slider**: Horizontal carousel of individual accounts (Cash, Bank, Credit Cards) showing live balances and available credit.
   - **Budget Progress**: Category-level monthly progress bars with reactive warning thresholds (green <75%, amber 75–90%, rose >90%).
   - **Recent Activity**: Reverse-chronological list of recent transactions.

2. **Quick Entry Flow (from Variant B)**:
   - **Category-First 2-Tap Interaction**: Tapping a category icon directly launches the input modal with that category preselected.
   - **VND Banknote Presets**: Quick-add buttons for standard Vietnamese currency amounts (`+20k`, `+50k`, `+100k`, `+500k`) allowing common daily transactions to be recorded in 2 taps (<3 seconds).
   - **Custom Numpad with `000`**: High-contrast numeric keypad with a dedicated triple-zero key tailored for zero-decimal VND values.

---

## 4. Consequences
- **Positive**:
  - Sub-3-second expense logging for common purchases.
  - Clear, zero-clutter financial overview on mobile viewports.
  - Seamless single-thumb accessibility.
- **Trade-offs / Mitigations**:
  - Mobile quick-entry modal requires careful responsive viewport testing to avoid overlap with virtual mobile keyboards (mitigated by custom in-app numeric keypad).
