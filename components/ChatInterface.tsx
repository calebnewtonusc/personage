'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const GOALS = [
  { label: 'Sleep & Recovery',    prompt: 'I want to improve my sleep and recovery.' },
  { label: 'Energy & Focus',      prompt: 'I need more energy and mental focus.' },
  { label: 'Immunity',            prompt: 'I want to strengthen my immune system.' },
  { label: 'Beauty & Skin',       prompt: 'I want to improve my skin, hair, and nails.' },
  { label: 'Stress & Mood',       prompt: 'I need help managing stress and improving my mood.' },
  { label: 'Heart Health',        prompt: 'I want to support my heart and circulation.' },
  { label: 'Weight Management',   prompt: 'I want help with weight and metabolism.' },
  { label: 'Brain & Memory',      prompt: 'I want to support my brain health and memory.' },
];

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end animate-fadeIn">
      <div className="w-7 h-7 rounded-full bg-brand-teal flex-shrink-0 mb-0.5 flex items-center justify-center">
        <span className="text-white text-[10px] font-bold tracking-widest">P</span>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-coral/60 animate-dot"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [showTyping, setShowTyping]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isWelcome = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id:        `u-${Date.now()}`,
      role:      'user',
      content:   content.trim(),
      timestamp: new Date(),
    };
    const asstId = `a-${Date.now()}`;
    const asstMsg: Message = {
      id:        asstId,
      role:      'assistant',
      content:   '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowTyping(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      setShowTyping(false);
      setStreamingId(asstId);
      setMessages(prev => [...prev, asstMsg]);

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m => m.id === asstId ? { ...m, content: m.content + chunk } : m)
        );
      }
    } catch (err) {
      setShowTyping(false);
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong.';
      setMessages(prev => [
        ...prev,
        {
          id:        asstId,
          role:      'assistant',
          content:   `I'm having trouble connecting right now.\n\n**Error:** ${errorMsg}\n\nPlease check your Ollama configuration and try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setShowTyping(false);
      setStreamingId(null);
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">

      {/* Messages or Welcome */}
      <div className="flex-1 overflow-y-auto px-5 py-6">

        {isWelcome ? (
          /* ── Welcome State ─────────────────────────────── */
          <div className="flex flex-col items-center justify-center min-h-full text-center gap-6 animate-fadeIn pb-8">

            <div className="space-y-2">
              <p className="text-[11px] text-brand-teal/60 tracking-[0.2em] uppercase font-medium">
                Your Personage Advisor
              </p>
              <h1 className="font-serif italic font-light text-brand-teal leading-tight"
                  style={{ fontSize: 'clamp(32px, 6vw, 48px)' }}>
                Build your perfect formula.
              </h1>
              <p className="text-brand-charcoal/50 text-sm max-w-xs mx-auto leading-relaxed">
                Tell me your health goals and I&apos;ll recommend a formula tailored just for you.
              </p>
            </div>

            {/* Goal chips */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {GOALS.map(goal => (
                <button
                  key={goal.label}
                  onClick={() => sendMessage(goal.prompt)}
                  className="
                    text-left px-4 py-3 rounded-xl bg-white border border-brand-coral/20
                    text-brand-teal text-[12.5px] font-medium tracking-wide
                    hover:bg-brand-teal hover:text-white hover:border-brand-teal
                    transition-all duration-150 shadow-sm
                  "
                >
                  {goal.label}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-brand-charcoal/30 tracking-wider uppercase">
              or type your question below
            </p>
          </div>

        ) : (
          /* ── Chat Messages ─────────────────────────────── */
          <div className="space-y-4 max-w-full">
            {messages.map(msg => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isStreaming={msg.id === streamingId}
              />
            ))}
            {showTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}

        {!isWelcome && <div ref={bottomRef} />}
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
      />

    </div>
  );
}
