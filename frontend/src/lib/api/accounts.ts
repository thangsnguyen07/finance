import type {
  AccountResponse,
  CreateAccountDto,
  UpdateAccountDto,
} from '@/types/api';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const DEV_USER_ID = 'dev_user_default';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}`;
    try {
      const errorJson = await res.json();
      if (Array.isArray(errorJson.message)) {
        errorMessage = errorJson.message.join(', ');
      } else if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

export async function getAccounts(
  includeArchived = false,
): Promise<AccountResponse[]> {
  const query = includeArchived ? '?includeArchived=true' : '';
  const res = await fetch(`${API_BASE}/accounts${query}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
  });
  return handleResponse<AccountResponse[]>(res);
}

export async function createAccount(
  dto: CreateAccountDto,
): Promise<AccountResponse> {
  const res = await fetch(`${API_BASE}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
    body: JSON.stringify(dto),
  });
  return handleResponse<AccountResponse>(res);
}

export async function updateAccount(
  id: string,
  dto: UpdateAccountDto,
): Promise<AccountResponse> {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
    body: JSON.stringify(dto),
  });
  return handleResponse<AccountResponse>(res);
}

export async function deleteAccount(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
  });
  return handleResponse<void>(res);
}
