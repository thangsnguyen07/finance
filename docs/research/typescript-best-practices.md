# Research: TypeScript Best Practices & Codebase Standards

- **Author**: AI Assistant & Maintainer (Thang Nguyen)
- **Primary Source**: [andredesousa/typescript-best-practices](https://github.com/andredesousa/typescript-best-practices)
- **Date**: 2026-10-08
- **Status**: Implemented

---

## 1. Executive Summary

This research investigates the foundational best practices for writing clean, resilient, and future-proof TypeScript and JavaScript applications based on the guidelines cataloged in [andredesousa/typescript-best-practices](https://github.com/andredesousa/typescript-best-practices). 

Our personal finance application operates in a domain where mathematical correctness, transactional integrity, and predictable state transitions are paramount. We adopt these practices across both the **NestJS Backend** and the **Next.js Frontend**.

---

## 2. Core Pillars & Architectural Standards

### 2.1 Strictest Compiler Configuration (`tsconfig.json`)
The TypeScript compiler should never guess or permit unsafe fallback behaviors. 
Both `backend/tsconfig.json` and `frontend/tsconfig.json` enforce:
- `"strict": true`: Activates `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, and `alwaysStrict`.
- `"noImplicitReturns": true`: Ensures all code paths in a function return an explicit value.
- `"noFallthroughCasesInSwitch": true`: Prevents accidental fall-through in switch blocks.
- `"forceConsistentCasingInFileNames": true`: Prevents cross-platform file import discrepancies (Linux vs Windows/macOS).

### 2.2 Avoid `any` — Type Everything
- **Zero `any` Policy**: The `any` type disables type checking and propagates unsafety across the codebase.
- **Dynamic Data**: When incoming data has an unknown shape (network payloads, error catches), use `unknown` instead of `any`. Narrow it via Type Guards (`instanceof Error`, Zod schemas, or `class-validator`).
- **Explicit Return Types on Public Boundaries**: All public API methods in controllers, services, and shared libraries declare explicit return types (`Promise<Account[]>`, `Promise<void>`) to prevent unintended signature regressions during refactoring.

### 2.3 Strings Should Be Safe (Union Literals)
Instead of bare `string`, use String Literal Unions for discrete domains:
```typescript
// Good: Type-safe literal union
export type AccountType = 'CASH' | 'BANK' | 'CREDIT_CARD' | 'E_WALLET' | 'INVESTMENT';
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

// Avoid: Permissive string
const type: string = 'CASH';
```

### 2.4 Use Built-in Utility Types
Avoid defining duplicate hand-rolled variations of types. Leverage TypeScript utility types:
- `Partial<T>`: For update patches where all fields are optional.
- `Readonly<T>`: For immutable data structures and state snapshots.
- `Pick<T, K>` & `Omit<T, K>`: For projecting domain entities to specific sub-models.
- `Record<K, V>`: For typed dictionary lookup tables (e.g. icon/color mappings).

### 2.5 Clean Function Design
- **Single Responsibility**: Each function performs one cohesive task. Keep methods concise (5–20 lines).
- **Parameter Consolidation**: Keep function parameters <= 2. When more arguments are required, consolidate into a typed DTO/Options object.
- **No Boolean Flags as Function Parameters**: A boolean argument (`doSomething(flag: boolean)`) signals that the function is doing two separate things based on an `if/else`. Split into two distinct, descriptive functions instead.

### 2.6 Naming Conventions & Boolean Prefixes
- Booleans must use prefixes: `is`, `has`, `should`, `can` (e.g. `is_archived`, `isLoading`, `hasOverdueBills`).
- Functions describing actions start with verbs (`createAccount`, `calculateNetWorth`).
- Consistent English naming across all layers.

### 2.7 Defensive Boundaries ("Do Not Trust Any Data")
- **Backend Ingress**: Every incoming HTTP request must pass through `ValidationPipe` with `class-validator` DTOs (`whitelist: true`, `forbidNonWhitelisted: true`).
- **Error Handling**: Throw only standard instances of `Error` or NestJS `HttpException`. Catch blocks must use `catch (err: unknown)` and narrow with `if (err instanceof Error)`.
- **Database BigInt**: Monetary numbers in PostgreSQL are stored as 64-bit `bigint` (to prevent integer overflow in VND). TypeORM entity transformers safely convert between database string representation and JavaScript numbers.

### 2.8 Functional Programming & Immutability
- Prefer pure functions without external side effects for business calculations (e.g., net worth aggregates, budget rollover calculations).
- Prefer array methods (`.map()`, `.filter()`, `.reduce()`) over imperative mutable loops for clarity and immutability.
- Use spread operator (`...`) and object destructuring for creating new state objects rather than mutating inputs.

---

## 3. Codebase Application Matrix

| Area | Backend (`backend/`) | Frontend (`frontend/`) |
| :--- | :--- | :--- |
| **Compiler Config** | `nodenext`, `strict: true`, `noImplicitReturns: true`, `noFallthroughCasesInSwitch: true` | `bundler`, `strict: true`, `noImplicitReturns: true`, `noFallthroughCasesInSwitch: true` |
| **Data Boundaries** | `class-validator` DTOs (`CreateAccountDto`, `UpdateAccountDto`) | TanStack Query hooks, `api.ts` typed interfaces |
| **Error Handling** | NestJS HTTP exceptions (`NotFoundException`, `ConflictException`) | `catch (err: unknown)` with user-facing message extraction |
| **Linter / Formatter** | Oxlint with type-aware inspection | Oxlint with React/Next.js rules |

---

## 4. References & Bibliography

- André de Sousa: [TypeScript Best Practices](https://github.com/andredesousa/typescript-best-practices)
- Official TypeScript Handbook: [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- Clean Code TypeScript: [labs42io/clean-code-typescript](https://github.com/labs42io/clean-code-typescript)
- Airbnb JavaScript Style Guide: [airbnb/javascript](https://github.com/airbnb/javascript)
