# ADR-0004: Budget Lifecycle, Warning Thresholds, and Rollover Policy

- **Status**: Accepted
- **Date**: 2026-09-21
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context

Effective budgeting requires a balance between proactive financial awareness and unobtrusive user experience. Overly strict rules that block transaction entry when a limit is exceeded cause users to abandon expense tracking. Conversely, ambiguous rollover rules can make month-to-month financial health difficult to assess.

---

## 2. Options Considered

### Budget Period Boundaries

- **Option A (Standard Calendar Month - Accepted)**: Calculate budgets from the 1st to the final day of each calendar month. Resets spent amounts at 00:00 on the 1st.
- **Option B (Custom Paycheck Cycle)**: Allow arbitrary monthly start dates (e.g. 5th of each month). Adds cognitive complexity for monthly reports.

### Over-Budget Enforcement

- **Option A (Soft Warnings & Visual Thresholds - Accepted)**: Reactive color progression (Green <75%, Amber 75–99%, Rose $\ge 100\%$) and non-blocking warning indicators during quick entry. Users can always save transactions.
- **Option B (Hard Blocking)**: Prevent recording expenses when a budget is depleted until the limit is raised. Distorts financial reality.

### Month-End Rollover Policy

- **Option A (Independent Monthly Resets by Default - Accepted)**: Each month starts afresh with its configured baseline limit. A per-category `is_rollover: boolean` flag enables voluntary surplus accumulation for designated sinking funds.
- **Option B (Universal Automatic Rollover)**: Force all deficits and surpluses to cascade indefinitely, complicating long-term category accounting.

---

## 3. Decision

We adopt **Standard Calendar Month Cycles**, **Tri-Color Visual Thresholds with Soft Warnings**, **Independent Monthly Resets with an Optional Category Rollover Toggle**, and **Dual Macro/Micro Budget Display** (Overall Monthly Limit on Hero Dashboard + Granular Category Progress Bars).

---

## 4. Consequences

- **Positive**:
  - Unbroken data capture flow (users are never blocked from recording genuine expenses).
  - Clear, immediate visual status of spending speed across categories.
  - Flexibility to save for intermittent expenses via per-category rollover flags while keeping regular expenses (e.g., dining, utilities) strictly contained within each month.
- **Trade-offs / Mitigations**:
  - Periodic background or query-level date checks required on month transitions to evaluate rollover balances for categories where `is_rollover == true`.
