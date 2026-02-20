'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi there! I'm **Sage**, your personal wellness advisor from Personage.

I'm here to help you find the perfect custom supplement formula for your health goals — or answer any questions you have about our products, orders, or subscriptions.

**What can I help you with today?**`,
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  'Help me find the right supplements',
  'What are your most popular formulas?',
  'How does Personage work?',
  'Do you have vegan options?',
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      const assistantId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput('');
      setIsLoading(true);
      setStreamingId(assistantId);

      try {
        const historyMessages = [...messages, userMessage]
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyMessages }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || 'Request failed');
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Something went wrong.';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `I'm having trouble connecting right now. ${errorMsg}\n\nPlease make sure your Ollama instance is running and \`OLLAMA_BASE_URL\` is set correctly.`,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        setStreamingId(null);
      }
    },
    [messages, isLoading]
  );

  const showQuickReplies = messages.length === 1 && !isLoading;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={message.id === streamingId}
          />
        ))}

        {showQuickReplies && (
          <div className="flex flex-wrap gap-2 pl-11">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="text-xs px-3.5 py-1.5 rounded-full border border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400 transition-colors cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
