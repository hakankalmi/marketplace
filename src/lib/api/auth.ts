import { api } from './client';
import type {
  RequestOtpRequest,
  VerifyOtpRequest,
  AuthResponseDto,
} from './types';

export async function requestOtp(
  data: RequestOtpRequest
): Promise<{ message: string }> {
  return api.post('/api/mp/auth/request-otp', data);
}

export async function verifyOtp(
  data: VerifyOtpRequest
): Promise<AuthResponseDto> {
  return api.post('/api/mp/auth/verify-otp', data);
}

export async function refreshToken(
  refreshToken: string
): Promise<AuthResponseDto> {
  return api.post('/api/mp/auth/refresh', { refreshToken });
}

export async function logout(): Promise<void> {
  return api.post('/api/mp/auth/logout');
}

/* ───── Token Helpers ───── */

export function saveAuth(auth: AuthResponseDto) {
  localStorage.setItem('mp_token', auth.token);
  localStorage.setItem('mp_refresh_token', auth.refreshToken);
  localStorage.setItem('mp_customer_id', auth.customerId);
  localStorage.setItem('mp_expires_at', auth.expiresAt);
  if (auth.name) localStorage.setItem('mp_customer_name', auth.name);
  if (auth.phone) localStorage.setItem('mp_customer_phone', auth.phone);
}

export function clearAuth() {
  localStorage.removeItem('mp_token');
  localStorage.removeItem('mp_refresh_token');
  localStorage.removeItem('mp_customer_id');
  localStorage.removeItem('mp_expires_at');
  localStorage.removeItem('mp_customer_name');
  localStorage.removeItem('mp_customer_phone');
}

export function getStoredAuth(): {
  token: string | null;
  customerId: string | null;
  name: string | null;
} {
  return {
    token: localStorage.getItem('mp_token'),
    customerId: localStorage.getItem('mp_customer_id'),
    name: localStorage.getItem('mp_customer_name'),
  };
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('mp_token');
  const expiresAt = localStorage.getItem('mp_expires_at');
  if (!token || !expiresAt) return false;
  return new Date(expiresAt) > new Date();
}
