import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from '@microsoft/signalr';
import { API_URL } from '@/lib/constants';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: 'customer' | 'company';
  senderId: string;
  senderName: string;
  content: string;
  messageType: number; // 0=Text, 1=Image, 2=Voice, 3=File, 4=Video, 5=System
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  isRead: boolean;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  marketplaceOrderId: number;
  orderCode: string;
  orderStatus: number;
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageSenderType?: string;
  unreadCount: number;
  createdAt: string;
}

export interface ChatStatus {
  isAvailable: boolean;
  isWritable: boolean;
  conversationId?: string;
  unreadCount: number;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  conversationId: string | null;
  isWritable: boolean;
}

let connection: HubConnection | null = null;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mp_token');
}

export function getConnection(): HubConnection | null {
  return connection;
}

export async function connectChat(): Promise<HubConnection> {
  if (connection?.state === HubConnectionState.Connected) {
    return connection;
  }

  // Stop any existing connection
  if (connection) {
    try { await connection.stop(); } catch { /* ignore */ }
  }

  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/hubs/marketplace-chat`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(
      process.env.NODE_ENV === 'production' ? LogLevel.Warning : LogLevel.Information
    )
    .build();

  await connection.start();
  return connection;
}

export async function disconnectChat(): Promise<void> {
  if (connection) {
    try { await connection.stop(); } catch { /* ignore */ }
    connection = null;
  }
}

export async function joinConversation(conversationId: string): Promise<void> {
  if (connection?.state === HubConnectionState.Connected) {
    await connection.invoke('JoinConversation', conversationId);
  }
}

export async function leaveConversation(conversationId: string): Promise<void> {
  if (connection?.state === HubConnectionState.Connected) {
    await connection.invoke('LeaveConversation', conversationId);
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  messageType: number = 0,
  fileUrl?: string,
  fileName?: string,
  fileSize?: number,
  duration?: number
): Promise<void> {
  if (connection?.state === HubConnectionState.Connected) {
    await connection.invoke(
      'SendMessage',
      conversationId,
      content,
      messageType,
      fileUrl ?? null,
      fileName ?? null,
      fileSize ?? null,
      duration ?? null
    );
  }
}

export async function markAsRead(conversationId: string): Promise<void> {
  if (connection?.state === HubConnectionState.Connected) {
    await connection.invoke('MarkAsRead', conversationId);
  }
}

export async function sendTyping(conversationId: string): Promise<void> {
  if (connection?.state === HubConnectionState.Connected) {
    await connection.invoke('SendTyping', conversationId);
  }
}
