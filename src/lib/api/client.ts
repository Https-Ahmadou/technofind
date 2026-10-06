import { ApiError } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

function getToken(): string | null {
  try {
    return typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: 'Une erreur est survenue',
      status: res.status,
    }));
    throw error;
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, opts?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...opts }),

  post: <T>(endpoint: string, body: unknown, opts?: RequestInit) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...opts }),

  put: <T>(endpoint: string, body: unknown, opts?: RequestInit) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...opts }),

  delete: <T>(endpoint: string, opts?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...opts }),
};