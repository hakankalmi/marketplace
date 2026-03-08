import { api } from './client';
import type {
  CreateOrderRequest,
  OrderResponseDto,
  CreateReviewRequest,
} from './types';

export async function getOrders(
  page = 1,
  pageSize = 20
): Promise<OrderResponseDto[]> {
  return api.get(`/api/mp/me/orders?page=${page}&pageSize=${pageSize}`);
}

export async function getOrderDetail(id: number): Promise<OrderResponseDto> {
  return api.get(`/api/mp/me/orders/${id}`);
}

export async function createOrder(
  data: CreateOrderRequest
): Promise<OrderResponseDto> {
  return api.post('/api/mp/me/orders', data);
}

export async function cancelOrder(
  id: number
): Promise<{ message: string }> {
  return api.post(`/api/mp/me/orders/${id}/cancel`);
}

export async function uploadOrderPhotos(
  orderId: number,
  data: { beforePhotoUrls?: string[]; afterPhotoUrls?: string[] }
): Promise<{ message: string }> {
  return api.post(`/api/mp/me/orders/${orderId}/photos`, data);
}

export async function submitReview(
  orderId: number,
  data: CreateReviewRequest
): Promise<{ id: number; message: string }> {
  return api.post(`/api/mp/me/orders/${orderId}/review`, data);
}
