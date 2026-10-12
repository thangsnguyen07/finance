# ADR-0001: Decoupled NestJS Backend and Clerk Authentication

- **Status**: Accepted
- **Date**: 2026-09-21
- **Decider(s)**: Maintainer (Thang Nguyen)

---

## 1. Context

The personal finance web application requires a decoupled architecture with a mobile-first frontend and a resilient backend API service to manage transactions, accounts, categories, and budgets, synchronized with a PostgreSQL database. A key objective is ensuring rapid developer velocity, end-to-end type safety, and seamless authentication without maintaining custom password hashing, reset workflows, and rate-limiting infrastructure.

---

## 2. Options Considered

### Backend Framework

1. **Option 1: FastAPI (Python 3.12+)**:
   - _Pros_: Native `decimal.Decimal` support; fast async performance; strong data analysis ecosystem.
   - _Cons_: Polyglot development (Python backend + TypeScript frontend) requiring two different language toolchains.
2. **Option 2: NestJS (TypeScript)**:
   - _Pros_: Full-stack TypeScript unity; enterprise-grade modular architecture (Modules, Controllers, Services); strong dependency injection; unified tooling across client and server.
   - _Cons_: Higher boilerplate; requires careful decimal handling (e.g. `decimal.js` / Prisma Decimal) to avoid IEEE-754 floating-point drift.
3. **Option 3: Express / Hono (TypeScript)**:
   - _Pros_: Minimalist, lightweight.
   - _Cons_: Unopinionated, requires assembling custom structure.

### Authentication Provider

1. **Option A: Custom Stateless JWT (In-Database)**:
   - _Pros_: Zero external vendor cost, full data sovereignty.
   - _Cons_: High engineering effort to build and maintain secure login, signup, refresh token rotation, email verification, and password resets.
2. **Option B: Supabase Auth**:
   - _Pros_: Integrated with PostgreSQL RLS, free tier up to 50k MAU.
   - _Cons_: Tied to Supabase infrastructure.
3. **Option C: Clerk Auth**:
   - _Pros_: Turn-key secure login/signup UI components, passkeys, multi-factor authentication (MFA), OAuth (Google, Apple), and effortless frontend SDK integration with backend JWKS session token verification.
   - _Cons_: Third-party service dependency.

---

## 3. Decision

We adopt **Option 2: NestJS (TypeScript) + PostgreSQL** for the backend service and **Option C: Clerk Auth** for identity and authentication management:

- **Unified TypeScript**: Sharing interfaces, DTO validation logic, and developer tooling across frontend and backend.
- **Clerk Authentication**: Frontend handles authentication via Clerk's React/Next.js components; backend NestJS protects API routes using a Clerk JWT verification guard (`@clerk/backend`).
- **Precision Monetary Handling**: Monetary amounts stored as PostgreSQL `NUMERIC(15, 2)` or integer minor units, manipulated with `decimal.js` on the server to prevent floating-point inaccuracy.

---

## 4. Consequences

- **Positive**:
  - Consistent developer experience in pure TypeScript across the entire repository.
  - Zero time spent reinventing authentication flows, password security, or OAuth handshakes.
  - Structured, maintainable backend architecture ready for modular domain expansion.
- **Negative / Trade-offs**:
  - Requires handling decimal calculations deliberately in Node.js via dedicated decimal libraries.
  - Usage limits of Clerk (free tier accommodates up to 10,000 monthly active users).
