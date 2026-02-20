'use client';

import { KeyboardEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-4">
      <div className="flex items-end gap-3">

        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your health goals, ingredients, or orders..."
          rows={1}
          disabled={isLoading}
          className="
            flex-1 resize-none rounded-xl bg-gray-50 border border-gray-100
            px-4 py-3 text-[13.5px] text-brand-charcoal placeholder-brand-charcoal/25
            focus:outline-none focus:bg-white focus:border-brand-teal/25 focus:ring-0
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors leading-relaxed
          "
        />

        {/* SEND pill — matches Personage button style */}
        <button
          onClick={() => onSend(value)}
          disabled={!value.trim() || isLoading}
          className="
            flex-shrink-0 h-[46px] px-5 rounded-full
            bg-brand-teal text-white
            text-[10.5px] font-bold tracking-[0.15em] uppercase
            hover:bg-brand-tealHov
            disabled:opacity-25 disabled:cursor-not-allowed
            transition-colors flex items-center gap-2
          "
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-[1.5px] border-white/60 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Send
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>

      </div>

      <p className="mt-2 text-[9.5px] text-brand-charcoal/18 tracking-[0.15em] uppercase text-right select-none">
        Enter to send &nbsp;&middot;&nbsp; Shift+Enter for new line
      </p>
    </div>
  );
}
