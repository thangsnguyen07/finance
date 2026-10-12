# ADR-0005: Offline-First Capability, Optimistic UI, and Idempotent Synchronization

- **Status**: Accepted
- **Date**: 2026-09-21
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context

Users frequently record transactions in environments with poor or nonexistent network connectivity (e.g. underground parking structures, basements, remote dining locations, airplane travel). A mobile application that displays a loading spinner or blocks input during connectivity interruptions directly degrades user trust and daily logging discipline.

---

## 2. Options Considered

### Offline Behavior

- **Option A (Offline-First with Optimistic UI - Accepted)**: Store transactions immediately into client-side IndexedDB. Apply state updates to the UI optimistically ($O(1)$ response time). A background sync manager automatically pushes pending mutations to the NestJS API upon detecting connectivity.
- **Option B (Online-Only with Error Alert)**: Block transaction entry and display network error dialogs when offline. Severely hinders mobile ergonomics.

### Duplicate Prevention & Conflict Resolution

- **Option A (Client-Generated Idempotency Keys - Accepted)**: Each transaction generated on the mobile client is assigned a unique UUID v4 (`client_tx_id`). The NestJS backend enforces a unique index on `(user_id, client_tx_id)`. Retrying requests across intermittent connections safely deduplicates at the database level.
- **Option B (Timestamp & Amount Deduplication Heuristic)**: Attempting to match date and amount heuristics on the server. Error-prone and susceptible to misidentifying legitimate identical payments.

---

## 3. Decision

We adopt **Offline-First Persistence with IndexedDB**, **Optimistic UI Updates**, and **Client-Generated UUID Idempotency Keys (`client_tx_id`)**:

- Client uses TanStack Query / IndexedDB storage for transaction caching and offline mutation queues.
- Server database schema includes `client_tx_id UUID NULL` with a partial unique index:
  `CREATE UNIQUE INDEX idx_transactions_client_tx_id ON transactions (user_id, client_tx_id) WHERE client_tx_id IS NOT NULL;`

---

## 4. Consequences

- **Positive**:
  - Instantaneous mobile interaction speed regardless of network signal strength.
  - Zero risk of duplicate transactions caused by network dropouts or automated retries.
  - Reliable data capture anytime, anywhere.
- **Trade-offs / Mitigations**:
  - Client state management must handle reconciliation if background syncing encounters validation errors (e.g. deleted account on another device). Mitigated by client toast alerts and rollback hooks.
