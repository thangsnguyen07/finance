# ADR-0006: Recurring Transactions and Subscription Approval Lifecycle

- **Status**: Accepted
- **Date**: 2026-09-21
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context

Recurring expenditures and revenues (rent, internet utilities, SaaS subscriptions, salary) occur on fixed calendar cycles. Fully automated background posting to account balances risks desynchronizing ledger balances with reality if an actual bank transfer has not yet cleared or if utility amounts fluctuate month-to-month.

---

## 2. Options Considered

### Transaction Generation Trigger

- **Option A (Actionable Approval Cards with 1-Tap Confirmation - Accepted)**: When a recurrence date arrives, the system surfaces a prominent Action Card in the mobile dashboard hero section (e.g. _"Due Today: Rent ₫4,500,000 from Techcombank"_). Clicking "Confirm Payment" posts the actual transaction to the ledger and decrements the balance.
- **Option B (Silent Automatic Background Posting)**: A cron job silently posts transactions and deductions at 00:00 without user awareness, leading to phantom deductions when payments are delayed.

### Variable Amount Bills

- **Option A (Variable Amount Support - Accepted)**: Support `is_variable_amount: boolean` for recurring bills whose amount changes monthly (electricity, water, credit card minimum due). Prompts user to verify or adjust the amount on the due date.
- **Option B (Strict Fixed Amounts Only)**: Forcing rigid amounts requires manual transaction editing every month.

---

## 3. Decision

We adopt **Due-Date Actionable Approval Cards** with 1-tap confirmation, and **Variable Amount Support (`is_variable_amount`)** for fluctuating monthly bills.

---

## 4. Consequences

- **Positive**:
  - High financial fidelity: Balances never deduct money that hasn't actually been paid.
  - Zero-friction confirmation: One tap on the dashboard logs the payment.
  - Seamless handling of variable utility bills common in Vietnamese households.
- **Trade-offs / Mitigations**:
  - Requires a pending notification query on dashboard load to aggregate due recurring items.
