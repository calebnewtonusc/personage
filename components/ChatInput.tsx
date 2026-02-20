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
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  return (
    <div className="flex-shrink-0 bg-white/70 backdrop-blur-sm border-t border-brand-coral/15 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-end gap-3">

        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your health goals, ingredients, or orders..."
          rows={1}
          disabled={isLoading}
          className="
            flex-1 resize-none rounded-xl bg-brand-cream border border-brand-coral/20
            px-4 py-2.5 text-[13.5px] text-brand-charcoal placeholder-brand-charcoal/30
            focus:outline-none focus:ring-2 focus:ring-brand-coral/30 focus:border-brand-coral/40
            disabled:opacity-40 disabled:cursor-not-allowed transition-all leading-relaxed
          "
        />

        <button
          onClick={() => onSend(value)}
          disabled={!value.trim() || isLoading}
          aria-label="Send"
          className="
            w-9 h-9 rounded-full bg-brand-teal text-white flex items-center justify-center
            flex-shrink-0 hover:bg-brand-tealHov disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors
          "
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-[1.5px] border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>

      </div>

      <p className="text-center text-[10px] text-brand-charcoal/25 mt-2 tracking-wide select-none">
        Enter to send &nbsp;&middot;&nbsp; Shift+Enter for new line
      </p>
    </div>
  );
}
