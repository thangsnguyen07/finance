import type {
  CategoryResponse,
  CategoryType,
  CreateCategoryDto,
} from '@/types/api';

const API_BASE =
  process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000/api/v1';
const DEV_USER_ID = 'dev_user_default';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}`;
    try {
      const errorJson = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(errorJson.message)) {
        errorMessage = errorJson.message.join(', ');
      } else if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

export async function getCategories(
  type?: CategoryType,
): Promise<CategoryResponse[]> {
  const query = type ? `?type=${type}` : '';
  const res = await fetch(`${API_BASE}/categories${query}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
  });
  return handleResponse<CategoryResponse[]>(res);
}

export async function createCategory(
  dto: CreateCategoryDto,
): Promise<CategoryResponse> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
    body: JSON.stringify(dto),
  });
  return handleResponse<CategoryResponse>(res);
}
