'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2 } from 'lucide-react';
import { getChatMessages } from '@/lib/api/chat';
import {
  connectChat,
  disconnectChat,
  joinConversation,
  leaveConversation,
  sendMessage,
  markAsRead,
  sendTyping,
  type ChatMessage,
} from '@/lib/marketplace-chat';
import { formatDate } from '@/lib/utils';

interface OrderChatProps {
  orderId: number;
  isWritable: boolean;
}

export function OrderChat({ orderId, isWritable }: OrderChatProps) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setChatConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [typingName, setTypingName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTypingSentRef = useRef<number>(0);

  // Load initial messages via REST
  const { data: chatData, isLoading } = useQuery({
    queryKey: ['chat', orderId],
    queryFn: () => getChatMessages(orderId),
    staleTime: 60_000,
  });

  // Initialize messages from REST response
  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages);
      setChatConversationId(chatData.conversationId);
    }
  }, [chatData]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // SignalR connection
  useEffect(() => {
    if (!conversationId) return;

    let mounted = true;

    const setup = async () => {
      try {
        const conn = await connectChat();
        if (!mounted) return;

        setConnected(true);

        // Join conversation group
        await joinConversation(conversationId);

        // Listen for new messages
        conn.on('ReceiveMessage', (msg: ChatMessage) => {
          if (!mounted) return;
          setMessages((prev) => {
            // Prevent duplicates
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          // Auto-mark as read if the message is from the other side
          if (msg.senderType === 'company') {
            markAsRead(conversationId);
          }
        });

        // Listen for read receipts
        conn.on('MessagesRead', () => {
          if (!mounted) return;
          setMessages((prev) =>
            prev.map((m) => (m.senderType === 'customer' ? { ...m, isRead: true } : m))
          );
        });

        // Listen for typing indicator
        conn.on('UserTyping', (data: { senderName: string }) => {
          if (!mounted) return;
          setTypingName(data.senderName);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingName(null), 3000);
        });

        // Mark existing messages as read
        await markAsRead(conversationId);
      } catch (err) {
        console.error('Chat connection failed:', err);
        if (mounted) setConnected(false);
      }
    };

    setup();

    return () => {
      mounted = false;
      if (conversationId) {
        leaveConversation(conversationId).catch(() => {});
      }
      disconnectChat();
      setConnected(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId]);

  // Send typing indicator (debounced to max once per 2s)
  const handleTyping = useCallback(() => {
    if (!conversationId) return;
    const now = Date.now();
    if (now - lastTypingSentRef.current > 2000) {
      lastTypingSentRef.current = now;
      sendTyping(conversationId);
    }
  }, [conversationId]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !conversationId || sending) return;

    const text = input.trim();
    setInput('');
    setSending(true);

    try {
      await sendMessage(conversationId, text);
    } catch (err) {
      console.error('Failed to send message:', err);
      setInput(text); // Restore input on failure
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-brand-text-muted" />
      </div>
    );
  }

  // No chat available
  if (!chatData?.conversationId && messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-brand-text-muted">
          Sohbet henüz başlamamış. Mesaj göndererek sohbeti başlatabilirsiniz.
        </p>
        {isWritable && (
          <div className="mt-4">
            <ChatInput
              input={input}
              setInput={setInput}
              sending={sending}
              onSend={handleSend}
              onKeyDown={handleKeyDown}
              onTyping={handleTyping}
              inputRef={inputRef}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 300, maxHeight: 500 }}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-2 px-1" style={{ maxHeight: 400 }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {typingName && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-text-muted/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-text-muted/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-text-muted/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-brand-text-muted">{typingName} yazıyor...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {isWritable ? (
        <ChatInput
          input={input}
          setInput={setInput}
          sending={sending}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          onTyping={handleTyping}
          inputRef={inputRef}
        />
      ) : (
        <div className="pt-3 border-t border-brand-border">
          <p className="text-xs text-center text-brand-text-muted">
            Bu sohbet artık yazılamaz durumda.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────── Message Bubble ─────────── */

function MessageBubble({ message }: { message: ChatMessage }) {
  const isCustomer = message.senderType === 'customer';
  const isSystem = message.messageType === 5;

  if (isSystem) {
    return (
      <div className="flex justify-center py-1">
        <span className="text-[11px] text-brand-text-muted bg-brand-surface px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl ${
          isCustomer
            ? 'bg-brand-primary text-white rounded-br-md'
            : 'bg-brand-surface text-brand-text border border-brand-border rounded-bl-md'
        }`}
      >
        {!isCustomer && (
          <p className="text-[10px] font-semibold text-brand-primary mb-0.5">
            {message.senderName}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`flex items-center justify-end gap-1 mt-0.5 ${
          isCustomer ? 'text-white/60' : 'text-brand-text-muted'
        }`}>
          <span className="text-[10px]">
            {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isCustomer && (
            <span className="text-[10px]">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Chat Input ─────────── */

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  sending: boolean;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onTyping: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function ChatInput({ input, setInput, sending, onSend, onKeyDown, onTyping, inputRef }: ChatInputProps) {
  return (
    <div className="flex items-center gap-2 pt-3 border-t border-brand-border">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onTyping();
        }}
        onKeyDown={onKeyDown}
        placeholder="Mesajınızı yazın..."
        className="flex-1 px-4 py-2.5 bg-brand-bg border border-brand-border rounded-full text-sm text-brand-text placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
        disabled={sending}
      />
      <button
        onClick={onSend}
        disabled={!input.trim() || sending}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary text-white disabled:opacity-40 transition-opacity shrink-0"
      >
        {sending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </button>
    </div>
  );
}
