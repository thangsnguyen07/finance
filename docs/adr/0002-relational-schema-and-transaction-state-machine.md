# ADR-0002: Core Relational Schema and Transaction State Machine

- **Status**: Accepted
- **Date**: 2026-09-21
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context
A personal finance application must accurately record financial events, maintain real-time account balances without performance degradation, account for credit card liabilities and statement cycles, support internal transfers without distorting income/expense analytics, and enable rapid categorization on mobile screens.

---

## 2. Options Considered

### Account Balance Tracking
- **Option A (Pure Ledger Sum)**: Query `SUM(amount)` across all historical transactions on every read. Free of sync bugs, but degrades to $O(N)$ query time as transactions accumulate.
- **Option B (Snapshot Balance with Row Locks - Accepted)**: Store `balance` on the `accounts` table. Update atomically inside an ACID transaction using `SELECT ... FOR UPDATE` row locks whenever transactions are inserted, updated, or deleted. Delivers $O(1)$ dashboard read latency.

### Credit Card Modeling
- **Option A (Generic Account with Negative Balance)**: Treat credit cards identically to cash/bank accounts with negative values. Lacks awareness of credit ceilings and payment due dates.
- **Option B (Dedicated Credit Card Model - Accepted)**: Store `credit_limit`, `balance` (outstanding debt), `statement_day`, and `due_day`. Define Net Worth as `SUM(Cash/Bank Balances) - SUM(Credit Card Balances)`.

### Transfers Between Accounts
- **Option A (Unified Transfer Record - Accepted)**: A single `Transaction` with `type = 'TRANSFER'` linking `source_account_id` and `destination_account_id`. Atomically updates both account balances in one transaction. Excluded from income/expense and budget calculations.
- **Option B (Paired Dual Records)**: Two linked transaction records (one expense, one income). Vulnerable to partial failures or split-state inconsistencies.

### Category Structure
- **Option A (Flat 1-Level Hierarchy - Accepted)**: Single-level categories with icons and colors for one-tap mobile selection. Seeded with default categories upon user onboarding.
- **Option B (Two-Level Parent-Child Hierarchy)**: Nested categories requiring two-step navigation, adding friction to quick mobile entry.

---

## 3. Decision
We adopt **Snapshot Balance with Row Locks**, **Dedicated Credit Card Attributes**, **Unified Single-Record Transfers**, and **Flat 1-Level Categories with Auto-Seeding**.

---

## 4. Consequences
- **Positive**:
  - Instant dashboard loading ($O(1)$ balance queries).
  - Accurate credit utilization tracking and timely payment reminders.
  - Safe, atomic fund transfers with zero distortion to spending reports.
  - Minimal friction for mobile expense logging (<5s interaction).
- **Trade-offs / Mitigations**:
  - Requires rigorous transactional isolation when modifying transactions to keep snapshot balances perfectly synchronized with ledger entries.
