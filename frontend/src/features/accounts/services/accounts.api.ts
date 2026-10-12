import { apiRequest } from '@/lib/api-client';

import type {
  AccountResponse,
  CreateAccountDto,
  UpdateAccountDto,
} from '../types/account.types';

export function getAccounts(): Promise<AccountResponse[]> {
  return apiRequest<AccountResponse[]>('/accounts');
}

export function createAccount(dto: CreateAccountDto): Promise<AccountResponse> {
  return apiRequest<AccountResponse>('/accounts', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function updateAccount(
  id: string,
  dto: UpdateAccountDto,
): Promise<AccountResponse> {
  return apiRequest<AccountResponse>(`/accounts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export function deleteAccount(id: string): Promise<void> {
  return apiRequest<void>(`/accounts/${id}`, {
    method: 'DELETE',
  });
}
