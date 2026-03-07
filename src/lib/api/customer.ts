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

/* ───── Public Data ───── */

export async function getCategories(): Promise<CategoryResponseDto[]> {
  return api.get('/api/mp/categories');
}

export async function getCities(): Promise<CityDto[]> {
  return api.get('/api/mp/cities');
}
