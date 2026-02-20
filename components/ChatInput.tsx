'use client';

import { KeyboardEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3 flex-shrink-0">
      <div className="flex items-end gap-3 max-w-2xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about supplements, ingredients, or your order..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
        />
        <button
          onClick={() => onSend(value)}
          disabled={!value.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2 select-none">
        <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-500">Enter</kbd> to send &nbsp;&middot;&nbsp;
        <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-500">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
