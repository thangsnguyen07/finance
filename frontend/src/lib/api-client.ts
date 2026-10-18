function getApiBase(): string {
  // In the browser, use relative path to route through Next.js reverse-proxy rewrite.
  // This completely masks the real backend URL in browser DevTools Network tab.
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }

  // Server-side (SSR / Node.js runtime)
  const rawUrl =
    process.env['BACKEND_API_URL'] ||
    process.env['NEXT_PUBLIC_API_URL'] ||
    'http://localhost:4000';
  const cleanUrl = rawUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
}

const DEV_USER_ID = 'dev_user_default';

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const base = getApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${base}${normalizedPath}`, {
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
