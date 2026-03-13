import { api } from './client';
import { API_URL, BRAND_CODE } from '@/lib/constants';
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

/** Upload a chat file through the backend proxy (JWT-authenticated, magic-bytes validated). */
export async function uploadChatFileViaBackend(
  orderId: number,
  file: Blob,
  fileName: string,
  folder: 'images' | 'voice' | 'files'
): Promise<{ url: string; fileName: string; fileSize: number; contentType: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mp_token') : null;
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file, fileName);
  formData.append('folder', folder);

  const res = await fetch(`${API_URL}/api/mp/me/orders/${orderId}/chat/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Marketplace-Brand': BRAND_CODE,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Upload failed');
  }

  return res.json();
}
