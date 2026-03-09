import { api } from './client';
import type {
  CustomerProfileDto,
  UpdateCustomerDto,
  AddressDto,
  CreateAddressRequest,
  UpdateAddressRequest,
  CategoryResponseDto,
  CityDto,
} from './types';

/* ───── Profile ───── */

export async function getProfile(): Promise<CustomerProfileDto> {
  return api.get('/api/mp/me');
}

export async function updateProfile(
  data: UpdateCustomerDto
): Promise<{ message: string }> {
  return api.put('/api/mp/me', data);
}

/* ───── Addresses ───── */

export async function getAddresses(): Promise<AddressDto[]> {
  return api.get('/api/mp/me/addresses');
}

export async function createAddress(
  data: CreateAddressRequest
): Promise<{ id: number; message: string }> {
  return api.post('/api/mp/me/addresses', data);
}

export async function updateAddress(
  id: number,
  data: UpdateAddressRequest
): Promise<{ message: string }> {
  return api.put(`/api/mp/me/addresses/${id}`, data);
}

export async function deleteAddress(
  id: number
): Promise<{ message: string }> {
  return api.delete(`/api/mp/me/addresses/${id}`);
}

export async function setDefaultAddress(
  id: number
): Promise<{ message: string }> {
  return api.post(`/api/mp/me/addresses/${id}/default`);
}

/* ───── Newsletter Preferences ───── */

export interface NewsletterPreferencesDto {
  isSubscribed: boolean;
  frequencyMonths: number;
  channels: string[];
  email: string | null;
}

export interface UpdateNewsletterDto {
  phone: string;
  email?: string | null;
  frequencyMonths: number;
  channels: string[];
}

export async function getNewsletterPreferences(): Promise<NewsletterPreferencesDto> {
  return api.get('/api/mp/me/newsletter');
}

export async function updateNewsletterPreferences(
  data: UpdateNewsletterDto
): Promise<{ message: string }> {
  return api.put('/api/mp/me/newsletter', data);
}

export async function unsubscribeNewsletter(): Promise<{ message: string }> {
  return api.delete('/api/mp/me/newsletter');
}

/* ───── Reviews ───── */

export async function getMyReviews(
  page = 1,
  pageSize = 20
): Promise<{ items: import('./types').ReviewDto[]; totalCount: number; page: number; pageSize: number }> {
  return api.get(`/api/mp/me/reviews?page=${page}&pageSize=${pageSize}`);
}

/* ───── Public Data ───── */

export async function getCategories(): Promise<CategoryResponseDto[]> {
  return api.get('/api/mp/categories');
}

export async function getCities(): Promise<CityDto[]> {
  const data = await api.get<CityDto[] | string[]>('/api/mp/cities');
  // API string[] veya CityDto[] dönebilir — normalize et
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
    return (data as string[]).map((city) => ({ city, companyCount: 0 }));
  }
  return data as CityDto[];
}
