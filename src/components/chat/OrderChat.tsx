'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, FileText, Play, Download, Paperclip, Mic, Square, X } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
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

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_DIMENSION = 1200;

function resizeChatImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
        resolve(file);
        return;
      }
      const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
}

async function uploadChatFile(
  file: File,
  orderId: number,
  folder: 'images' | 'files'
): Promise<{ url: string; name: string; size: number }> {
  let blob: Blob = file;
  let contentType = file.type;

  if (folder === 'images' && file.type.startsWith('image/')) {
    blob = await resizeChatImage(file);
    contentType = 'image/jpeg';
  }

  const ext = folder === 'images' ? 'jpg' : file.name.split('.').pop() || 'bin';
  const path = `marketplace-chat/${orderId}/${folder}/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, blob, { contentType });
  const url = await getDownloadURL(storageRef);

  return { url, name: file.name, size: file.size };
}

async function uploadVoiceBlob(
  blob: Blob,
  orderId: number,
  duration: number
): Promise<{ url: string; size: number; duration: number }> {
  const path = `marketplace-chat/${orderId}/voice/${Date.now()}.webm`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType: 'audio/webm' });
  const url = await getDownloadURL(storageRef);
  return { url, size: blob.size, duration };
}

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
  const [recording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTypingSentRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const recordingDurationRef = useRef(0);
  const conversationIdRef = useRef<string | null>(null);

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
      conversationIdRef.current = chatData.conversationId;
    }
  }, [chatData]);

  // Auto-scroll to bottom on messages change and on initial mount
  const scrollToBottom = useCallback(() => {
    // Use setTimeout to ensure DOM is rendered (especially after tab switch)
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Also scroll on first render / tab switch (chatData loaded from cache)
  useEffect(() => {
    if (chatData?.messages?.length) {
      scrollToBottom();
    }
  }, [chatData, scrollToBottom]);

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

  // Send text message
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

  // Send file/image
  const handleFileSelect = async (file: File) => {
    if (!conversationId || sending) return;
    if (file.size > MAX_UPLOAD_SIZE) {
      alert('Dosya boyutu 10MB\'dan küçük olmalı.');
      return;
    }

    setSending(true);
    try {
      const isImage = file.type.startsWith('image/');
      const folder = isImage ? 'images' : 'files';
      const result = await uploadChatFile(file, orderId, folder);
      const messageType = isImage ? 1 : 3; // 1=Image, 3=File
      await sendMessage(
        conversationId,
        result.name,
        messageType,
        result.url,
        result.name,
        result.size
      );
    } catch (err) {
      console.error('Failed to send file:', err);
      alert('Dosya gönderilemedi.');
    } finally {
      setSending(false);
    }
  };

  // Voice recording
  const startRecording = async () => {
    if (!conversationId || sending) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detect supported mimeType
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      recordingChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordingChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordingChunksRef.current, { type: mimeType });
        if (blob.size < 1000) return; // too short, ignore

        // Use refs for fresh values (avoid stale closures)
        const convId = conversationIdRef.current;
        const duration = recordingDurationRef.current;

        if (!convId) {
          console.error('Voice: conversationId is null');
          return;
        }

        setSending(true);
        try {
          const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const result = await uploadVoiceBlob(blob, orderId, duration);
          await sendMessage(
            convId,
            'Ses mesajı',
            2, // Voice
            result.url,
            `voice.${ext}`,
            result.size,
            result.duration
          );
        } catch (err) {
          console.error('Failed to send voice:', err);
          alert('Ses mesajı gönderilemedi.');
        } finally {
          setSending(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordingDuration(0);
      recordingDurationRef.current = 0;
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((d) => {
          recordingDurationRef.current = d + 1;
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access failed:', err);
      alert('Mikrofon erişimi reddedildi.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = undefined;
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    recordingChunksRef.current = [];
    setRecording(false);
    setRecordingDuration(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = undefined;
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
              onFileSelect={handleFileSelect}
              recording={recording}
              recordingDuration={recordingDuration}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onCancelRecording={cancelRecording}
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
          onFileSelect={handleFileSelect}
          recording={recording}
          recordingDuration={recordingDuration}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onCancelRecording={cancelRecording}
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
        <MessageContent message={message} isCustomer={isCustomer} />
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

/* ─────────── Message Content (by type) ─────────── */

function MessageContent({ message, isCustomer }: { message: ChatMessage; isCustomer: boolean }) {
  // Image
  if (message.messageType === 1 && message.fileUrl) {
    return (
      <div className="space-y-1">
        <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={message.fileUrl}
            alt={message.fileName || 'Resim'}
            className="max-w-[240px] max-h-[240px] rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        </a>
        {message.content && message.content !== message.fileName && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
    );
  }

  // Voice
  if (message.messageType === 2 && message.fileUrl) {
    const durationLabel = message.duration
      ? `${Math.floor(message.duration / 60)}:${String(message.duration % 60).padStart(2, '0')}`
      : '';
    return (
      <div className="flex items-center gap-2 min-w-[160px]">
        <a
          href={message.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${
            isCustomer ? 'bg-white/20' : 'bg-brand-primary/10'
          }`}
        >
          <Play size={14} className={isCustomer ? 'text-white' : 'text-brand-primary'} />
        </a>
        <div className="flex-1">
          <div className={`h-1 rounded-full ${isCustomer ? 'bg-white/30' : 'bg-brand-primary/20'}`} />
        </div>
        {durationLabel && (
          <span className={`text-[10px] ${isCustomer ? 'text-white/70' : 'text-brand-text-muted'}`}>
            {durationLabel}
          </span>
        )}
      </div>
    );
  }

  // File
  if (message.messageType === 3 && message.fileUrl) {
    return (
      <a
        href={message.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <FileText size={18} className={isCustomer ? 'text-white/80' : 'text-brand-primary'} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{message.fileName || 'Dosya'}</p>
          {message.fileSize && (
            <p className={`text-[10px] ${isCustomer ? 'text-white/60' : 'text-brand-text-muted'}`}>
              {(message.fileSize / 1024).toFixed(0)} KB
            </p>
          )}
        </div>
        <Download size={14} className={isCustomer ? 'text-white/60' : 'text-brand-text-muted'} />
      </a>
    );
  }

  // Video
  if (message.messageType === 4 && message.fileUrl) {
    return (
      <div className="space-y-1">
        <video
          src={message.fileUrl}
          controls
          preload="metadata"
          className="max-w-[280px] max-h-[200px] rounded-lg"
        />
        {message.content && message.content !== message.fileName && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
    );
  }

  // Text (default)
  return <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>;
}

/* ─────────── Chat Input ─────────── */

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  sending: boolean;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onTyping: () => void;
  onFileSelect: (file: File) => void;
  recording: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function ChatInput({
  input, setInput, sending, onSend, onKeyDown, onTyping, onFileSelect,
  recording, recordingDuration, onStartRecording, onStopRecording, onCancelRecording,
  inputRef,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Recording mode
  if (recording) {
    return (
      <div className="flex items-center gap-2 pt-3 border-t border-brand-border">
        <button
          onClick={onCancelRecording}
          className="w-10 h-10 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-all shrink-0"
          title="İptal"
        >
          <X size={18} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-600">
            {formatDuration(recordingDuration)}
          </span>
          <span className="text-xs text-red-400">Kayıt yapılıyor...</span>
        </div>
        <button
          onClick={onStopRecording}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary text-white transition-opacity shrink-0"
          title="Gönder"
        >
          <Send size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 pt-3 border-t border-brand-border">
      {/* Attach button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={sending}
        className="w-10 h-10 flex items-center justify-center rounded-full text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/5 disabled:opacity-40 transition-all shrink-0"
        title="Dosya veya resim ekle"
      >
        <Paperclip size={18} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = '';
        }}
      />

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

      {/* Send text or start voice */}
      {input.trim() ? (
        <button
          onClick={onSend}
          disabled={sending}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary text-white disabled:opacity-40 transition-opacity shrink-0"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      ) : (
        <button
          onClick={onStartRecording}
          disabled={sending}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary text-white disabled:opacity-40 transition-opacity shrink-0"
          title="Ses kaydı"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
        </button>
      )}
    </div>
  );
}
