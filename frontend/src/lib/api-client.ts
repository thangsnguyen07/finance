const DEV_USER_ID = 'dev_user_default';

const API_BASE =
  typeof window !== 'undefined'
    ? '/api/v1'
    : `${(process.env['BACKEND_API_URL'] ?? 'http://localhost:4000').replace(/\/+$/, '')}/api/v1`;

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
      ...options?.headers,
    },
  });

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
      // Ignore non-JSON error body
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
