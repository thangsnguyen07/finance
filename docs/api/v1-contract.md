# REST API v1 Specification & DTO Blueprint

- **Status**: Stable
- **Version**: 1.0.0
- **Base URL**: `/api/v1`
- **Authentication**: Bearer JWT (`Authorization: Bearer <clerk_jwt_token>`)

---

## 1. Architectural Philosophy

Frontend (`frontend/`) and Backend (`backend/`) operate as **two decoupled, independent source bases**. 
This document acts as the definitive contract:
- Backend implements NestJS controllers and DTOs using `class-validator` / `class-transformer`.
- Frontend defines TypeScript interface mirrors in `frontend/src/types/api.ts`.
- Changes to endpoints or payload schemas require explicit versioning and mutual agreement.

---

## 2. Standard Request & Response Envelopes

### 2.1 Success Responses
Direct REST representation with standard HTTP status codes (no unnecessary wrapper envelopes):
- `200 OK`: Request succeeded, payload returned directly (Object or Array).
- `201 Created`: Resource created successfully.
- `204 No Content`: Successful deletion or action with no response body.

### 2.2 Error Envelope
All error responses adhere to the standard NestJS exception schema:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "amount must be a positive number",
    "account_id must be a UUID"
  ],
  "timestamp": "2026-10-07T15:00:00.000Z"
}
```

### 2.3 Idempotency & Conflict Handling (HTTP 409)
Duplicate requests containing an identical `client_tx_id` return:

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Transaction with client_tx_id '550e8400-e29b-41d4-a716-446655440000' already exists",
  "timestamp": "2026-10-07T15:00:00.000Z"
}
```

---

## 3. Account / Wallet Endpoints (`/api/v1/accounts`)

### 3.1 Data Model: `Account`
```typescript
export type AccountType = 'CASH' | 'BANK' | 'CREDIT_CARD' | 'E_WALLET' | 'INVESTMENT';

export interface AccountResponse {
  id: string; // UUID
  userId: string;
  name: string;
  type: AccountType;
  currency: 'VND';
  currentBalance: number; // Stored as integer VND in DB
  creditLimit?: number | null; // For CREDIT_CARD
  statementDay?: number | null; // Day of month (1-31)
  isArchived: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string;
}
```

### 3.2 `GET /api/v1/accounts`
Returns all active accounts for the authenticated user.
- **Query Parameters**:
  - `includeArchived` (optional boolean, default `false`)
- **Response `200 OK`**: `AccountResponse[]`

### 3.3 `POST /api/v1/accounts`
Creates a new account/wallet.
- **Request Body**:
  ```typescript
  export interface CreateAccountDto {
    name: string; // Max 100 chars
    type: AccountType;
    initialBalance: number; // >= 0
    currency?: 'VND'; // Defaults to VND
    creditLimit?: number; // Optional for CREDIT_CARD
    statementDay?: number; // 1-31 optional
  }
  ```
- **Response `201 Created`**: `AccountResponse`

### 3.4 `GET /api/v1/accounts/:id`
- **Response `200 OK`**: `AccountResponse`
- **Response `404 Not Found`**: Account does not exist or belongs to another user.

### 3.5 `PATCH /api/v1/accounts/:id`
Updates mutable account attributes (balance is modified exclusively via transactions).
- **Request Body**:
  ```typescript
  export interface UpdateAccountDto {
    name?: string;
    creditLimit?: number;
    statementDay?: number;
    isArchived?: boolean;
  }
  ```
- **Response `200 OK`**: `AccountResponse`

### 3.6 `DELETE /api/v1/accounts/:id`
Soft-deletes or archives an account.
- **Response `204 No Content`**

---

## 4. Transaction Endpoints (`/api/v1/transactions`)

### 4.1 Data Model: `Transaction`
```typescript
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TransactionStatus = 'CLEARED' | 'UNCLEARED' | 'RECONCILED';

export interface TransactionResponse {
  id: string; // UUID
  client_tx_id: string; // Idempotency UUID
  account_id: string;
  account_name: string;
  category_id?: string | null;
  category_name?: string | null;
  target_account_id?: string | null; // For TRANSFER
  target_account_name?: string | null;
  amount: number; // Integer VND
  type: TransactionType;
  status: TransactionStatus;
  transaction_date: string; // YYYY-MM-DD
  description?: string | null;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
}
```

### 4.2 `GET /api/v1/transactions`
Paginated and filterable transaction list.
- **Query Parameters**:
  - `account_id` (optional UUID)
  - `category_id` (optional UUID)
  - `type` (optional `INCOME` | `EXPENSE` | `TRANSFER`)
  - `start_date` (optional `YYYY-MM-DD`)
  - `end_date` (optional `YYYY-MM-DD`)
  - `page` (optional integer, default `1`)
  - `limit` (optional integer, default `30`, max `100`)
- **Response `200 OK`**:
  ```typescript
  export interface PaginatedTransactionsResponse {
    items: TransactionResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }
  ```

### 4.3 `POST /api/v1/transactions`
Atomic transaction creation with account snapshot balance update.
- **Request Body**:
  ```typescript
  export interface CreateTransactionDto {
    client_tx_id: string; // Client-generated UUID for idempotency
    account_id: string; // UUID
    amount: number; // > 0 integer VND
    type: TransactionType;
    category_id?: string; // Required for EXPENSE, optional for INCOME
    target_account_id?: string; // Required for TRANSFER
    transaction_date: string; // YYYY-MM-DD
    description?: string;
    tags?: string[];
  }
  ```
- **Response `201 Created`**: `TransactionResponse`
- **Response `409 Conflict`**: Duplicate `client_tx_id`.

### 4.4 `PATCH /api/v1/transactions/:id`
Updates an existing transaction and atomically adjusts balances.
- **Response `200 OK`**: `TransactionResponse`

### 4.5 `DELETE /api/v1/transactions/:id`
Deletes a transaction and reverses its balance impact atomically.
- **Response `204 No Content`**

---

## 5. Category Endpoints (`/api/v1/categories`)

```typescript
export interface CategoryResponse {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
  parent_id?: string | null;
  is_system_default: boolean;
}
```

- `GET /api/v1/categories`: List default & user categories.
- `POST /api/v1/categories`: Create a user-custom category.

---

## 6. Budget Endpoints (`/api/v1/budgets`)

### 6.1 `GET /api/v1/budgets/current`
Aggregated budget overview for a specific month.
- **Query Parameters**:
  - `month` (e.g. `2026-10`, defaults to current month)
- **Response `200 OK`**:
  ```typescript
  export interface BudgetSummaryResponse {
    month: string; // YYYY-MM
    total_budgeted: number;
    total_spent: number;
    overall_percentage: number;
    categories: {
      category_id: string;
      category_name: string;
      limit_amount: number;
      spent_amount: number;
      percentage: number;
      is_over_budget: boolean;
      rollover_amount: number;
    }[];
  }
  ```

### 6.2 `PUT /api/v1/budgets`
Sets or updates the spending limit for a category in a month.
- **Request Body**:
  ```typescript
  export interface SetBudgetDto {
    category_id: string;
    month: string; // YYYY-MM
    limit_amount: number; // >= 0
    rollover_enabled?: boolean;
  }
  ```
- **Response `200 OK`**: Updated budget entry.

---

## 7. Recurring Transaction Endpoints (`/api/v1/recurring`)

- `GET /api/v1/recurring`: List all configured recurring rules.
- `POST /api/v1/recurring`: Create a recurring rule.
- `GET /api/v1/recurring/pending`: List pending bills requiring user approval.
- `POST /api/v1/recurring/:id/approve`: Approve a pending occurrence into a real transaction.
- `POST /api/v1/recurring/:id/skip`: Dismiss a pending occurrence.
