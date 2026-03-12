import { api } from './client';
import type { ChatMessagesResponse, ChatStatus, ChatConversation } from '@/lib/marketplace-chat';

export function getChatMessages(orderId: number, skip = 0, take = 50) {
  return api.get<ChatMessagesResponse>(
    `/api/mp/me/orders/${orderId}/chat?skip=${skip}&take=${take}`
  );
}

export function getChatStatus(orderId: number) {
  return api.get<ChatStatus>(`/api/mp/me/orders/${orderId}/chat/status`);
}

export function getChatConversations() {
  return api.get<ChatConversation[]>('/api/mp/me/chat/conversations');
}
