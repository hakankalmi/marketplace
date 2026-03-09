import { API_URL, BRAND_CODE } from '@/lib/constants';
import { getAttributionHeader } from '@/lib/attribution';

class ApiError extends Error {
  constructor(
    public status: number,
    public errorCode: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mp_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Marketplace-Brand': BRAND_CODE,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Send ad attribution data (gclid, fbclid, utm_*) for server-side analytics
  const attribution = getAttributionHeader();
  if (attribution) {
    headers['X-Attribution'] = attribution;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorCode = 'UNKNOWN';
    let message = res.statusText;
    try {
      const body = await res.json();
      if (process.env.NODE_ENV !== 'production') {
        console.error('[API Error]', res.status, path, body?.errorCode);
      }
      errorCode = body.errorCode || errorCode;
      // Handle ASP.NET validation errors format
      if (body.errors) {
        const validationMessages = Object.entries(body.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('; ');
        message = validationMessages || body.title || message;
      } else {
        message = body.message || body.title || message;
      }
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, errorCode, message);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};

export { ApiError };
