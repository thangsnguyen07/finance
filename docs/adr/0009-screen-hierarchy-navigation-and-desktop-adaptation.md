# ADR-0009: Screen Hierarchy, Navigation Flows & Desktop Adaptation

- **Status**: Accepted
- **Date**: 2026-10-07
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context

Ticket #12 investigated the application's page hierarchy, navigation paradigm, and responsive strategy across mobile devices and desktop screens. 
The application adopts a **Mobile-First** approach with the **Paperlike** visual identity. We need an ergonomic navigation model that allows rapid financial recording on mobile while delivering an expansive, elegant ledger experience on desktop and tablet viewports without architectural divergence.

---

## 2. Decision

### 2.1 Primary Mobile Navigation (Bottom Nav Bar)
On mobile devices (`< 1024px`), navigation is anchored by a persistent, fixed **5-Tab Bottom Navigation Bar**:
1. **Tổng quan / Dashboard (`/`)**: High-level financial pulse, net worth summary, recent transactions, budget gauges.
2. **Sổ giao dịch / Transactions (`/transactions`)**: Searchable, filterable ledger feed grouped by date.
3. **[+] Ghi chép / Quick Entry (Center Trigger)**: Elevated prominent action button invoking transaction creation.
4. **Ngân sách / Budgets (`/budgets`)**: Monthly category spending limits, visual progress bars, rollover status.
5. **Ví & Tài khoản / Accounts (`/accounts`)**: Balance breakdown by account type (Cash, Bank Accounts, Credit Cards) with account creation and editing.

*User Settings & Profile (`/settings`)* are decoupled from the bottom bar and placed at the top-right header avatar icon to preserve navigation bar density.

### 2.2 Transaction Creation Interaction Flow
- **Mobile (`< 1024px`)**: Tapping `[+]` opens an accessible **Bottom Sheet Drawer** occupying ~85% viewport height. This keeps the transaction form within thumb reach, avoids full-page navigation latency, and preserves background scroll context.
- **Desktop (`>= 1024px`)**: Clicking `[+]` or invoking shortcut `N` opens a centered **Floating Modal Dialog**.

### 2.3 Desktop & Tablet Responsive Adaptation (`>= 1024px`)
Rather than boxing the desktop experience into an artificial mobile phone frame (`max-w-md`), the layout transforms into a **Responsive Hybrid**:
1. **Left Sidebar Navigation**: Bottom tabs convert into a sleek, fixed vertical sidebar containing navigation links, brand identity, and user profile.
2. **Two-Column Ledger Layout**:
   - **Primary Column (Left/Center)**: Main functional views (transaction list table, budget category grids).
   - **Secondary Column (Right)**: Persistent ledger context (Account balance cards, Net worth overview, monthly spending snapshot).

---

## 3. Route Map (Next.js App Router)

```text
frontend/src/app/
├── (app)/
│   ├── layout.tsx             # Shared shell: BottomNav (mobile) & Sidebar (desktop)
│   ├── page.tsx               # / (Dashboard)
│   ├── transactions/
│   │   └── page.tsx           # /transactions (Ledger)
│   ├── budgets/
│   │   └── page.tsx           # /budgets (Budgets)
│   ├── accounts/
│   │   └── page.tsx           # /accounts (Wallets & Accounts)
│   └── settings/
│       └── page.tsx           # /settings (Preferences & Profile)
├── (auth)/
│   ├── sign-in/[[...rest]]/   # Clerk Auth Sign In
│   └── sign-up/[[...rest]]/   # Clerk Auth Sign Up
└── globals.css                # Paperlike tokens & Tailwind v4
```

---

## 4. Consequences

### Positive
- **Thumb-Zone Optimization**: Core logging action `[+]` is centered and reachable with one hand.
- **Context Preservation**: Bottom sheet entry avoids disrupting user position in transaction feeds.
- **Seamless Desktop Scaling**: Uses screen real estate productively with side-by-side ledger tables without rewriting core components.
- **Predictable Routing**: Clean URL structure mapping 1:1 with Next.js App Router conventions.

### Mitigations
- Form drawer and modal share common form components (`TransactionForm`) to prevent duplicated input logic.
