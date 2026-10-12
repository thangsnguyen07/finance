# ADR-0007: TypeORM for Backend Database Management

- **Status**: Accepted
- **Date**: 2026-09-22
- **Decider(s)**: Maintainer (Thang Nguyen) & AI Assistant

---

## 1. Context

The backend API requires an Object-Relational Mapping (ORM) framework to interact with PostgreSQL. While Prisma was initially evaluated, the maintainer selected TypeORM for explicit entity decorator mapping and native NestJS architectural alignment.

---

## 2. Options Considered

- **Option A: TypeORM (`@nestjs/typeorm`, `typeorm`, `pg`) - Accepted**:
  - _Pros_: Native integration with NestJS Dependency Injection; decorator-driven entity declarations (`@Entity()`, `@Column()`, `@ManyToOne()`) that co-locate schema definition with TypeScript class structures; granular transaction control via `DataSource` / `QueryRunner` for row-level locking (`FOR UPDATE`).
  - _Cons_: Requires disciplined migration management.
- **Option B: Prisma ORM**:
  - _Pros_: Concise `schema.prisma` DSL, auto-generated client.
  - _Cons_: Separate binary engine, less native within NestJS class-validator/DTO patterns.

---

## 3. Decision

We adopt **TypeORM** with PostgreSQL for the backend service (`backend/`). Entity models will define the domain tables (`accounts`, `transactions`, `categories`, `budgets`, `recurring_transactions`) using Data Mapper repository patterns.

---

## 4. Consequences

- **Positive**:
  - Direct synergy with NestJS modules and decorators.
  - Full control over SQL generation and atomic row locks.
  - No external Rust binary required during runtime or containerization.
- **Trade-offs / Mitigations**:
  - TypeORM migrations must be maintained via TypeORM CLI scripts.
