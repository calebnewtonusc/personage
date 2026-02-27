'use client';

import { useReducer, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const GOALS = [
  { label: 'Sleep & Recovery',      prompt: 'My patient needs help with sleep quality and overnight recovery. Please recommend a formula.' },
  { label: 'Energy & Fatigue',      prompt: 'My patient is experiencing chronic fatigue and low energy. Please recommend an evidence-based formula.' },
  { label: 'Inflammation & Pain',   prompt: 'My patient has chronic inflammation and joint pain. Please recommend a formula with evidence-based anti-inflammatory ingredients.' },
  { label: 'Immunity',              prompt: 'I want to strengthen my patient\'s immune function. Please recommend an immunity formula.' },
  { label: 'Stress & Mood',         prompt: 'My patient is dealing with chronic stress and mood dysregulation. Please recommend an adaptogen-based formula.' },
  { label: 'Gut Health',            prompt: 'My patient has gut permeability and dysbiosis concerns. Please recommend a gut health formula.' },
  { label: 'Brain & Memory',        prompt: 'My patient wants to support cognitive function and memory. Please recommend a nootropic formula.' },
  { label: 'Heart Health',          prompt: 'My patient wants cardiovascular support. Please recommend a heart health formula with dosages.' },
  { label: 'Hormonal Balance',      prompt: 'My patient is experiencing hormonal imbalance. Please recommend a formula to support hormonal regulation.' },
  { label: 'Athletic Performance',  prompt: 'My patient is an athlete looking to optimize performance and recovery. Please recommend a formula.' },
];

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end animate-fadeIn">
      <div className="w-7 h-7 rounded-full bg-brand-teal flex-shrink-0 flex items-center justify-center shadow-sm shadow-brand-teal/20">
        <span className="text-white text-[9px] font-bold tracking-widest">P</span>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5 items-center">
        {[0, 1, 2].map(dotNum => (
          <span
            key={`dot-${dotNum}`}
            className="w-[5px] h-[5px] rounded-full bg-brand-teal/25 animate-dot"
            style={{ animationDelay: `${dotNum * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── State / Reducer ──────────────────────────────────────────────────────────

interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  streamingId: string | null;
  showTyping: boolean;
}

type ChatAction =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'APPEND_USER_MSG'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SHOW_TYPING'; payload: boolean }
  | { type: 'BEGIN_ASSISTANT_MSG'; payload: Message; streamingId: string }
  | { type: 'APPEND_CHUNK'; id: string; chunk: string }
  | { type: 'STREAMING_DONE' };

const initialState: ChatState = {
  messages: [],
  input: '',
  isLoading: false,
  streamingId: null,
  showTyping: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'APPEND_USER_MSG':
      return { ...state, messages: [...state.messages, action.payload], input: '' };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SHOW_TYPING':
      return { ...state, showTyping: action.payload };
    case 'BEGIN_ASSISTANT_MSG':
      return {
        ...state,
        showTyping: false,
        streamingId: action.streamingId,
        messages: [...state.messages, action.payload],
      };
    case 'APPEND_CHUNK':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.id ? { ...m, content: m.content + action.chunk } : m
        ),
      };
    case 'STREAMING_DONE':
      return { ...state, isLoading: false, showTyping: false, streamingId: null };
    default:
      return state;
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ChatInterface() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { messages, input, isLoading, streamingId, showTyping } = state;
  const bottomRef = useRef<HTMLDivElement>(null);
  const isWelcome = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`, role: 'user', content: content.trim(), timestamp: new Date(),
    };
    const asstId = `a-${Date.now()}`;

    dispatch({ type: 'APPEND_USER_MSG', payload: userMsg });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_SHOW_TYPING', payload: true });

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      dispatch({
        type: 'BEGIN_ASSISTANT_MSG',
        payload: { id: asstId, role: 'assistant', content: '', timestamp: new Date() },
        streamingId: asstId,
      });

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        dispatch({ type: 'APPEND_CHUNK', id: asstId, chunk });
      }
    } catch (err) {
      dispatch({ type: 'SET_SHOW_TYPING', payload: false });
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      dispatch({
        type: 'BEGIN_ASSISTANT_MSG',
        payload: {
          id: asstId, role: 'assistant',
          content: `Sorry, I'm having trouble connecting right now.\n\n**Error:** ${msg}\n\nPlease check your API configuration and try again.`,
          timestamp: new Date(),
        },
        streamingId: asstId,
      });
    } finally {
      dispatch({ type: 'STREAMING_DONE' });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto">
        {isWelcome ? (

          /* ── Welcome ────────────────────────────────── */
          <div className="flex flex-col items-center justify-center min-h-full px-8 py-14 text-center animate-fadeIn">

            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-brand-teal flex items-center justify-center mb-8 shadow-lg shadow-brand-teal/15">
              <span className="text-white text-sm font-bold tracking-[0.15em]">P</span>
            </div>

            {/* Heading */}
            <h1
              className="font-serif italic font-light text-brand-teal leading-[1.15] mb-3"
              style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
            >
              AI Formula<br />Recommendation Engine
            </h1>

            {/* Subtext */}
            <p className="text-brand-charcoal/40 text-[13px] leading-relaxed max-w-[310px] mb-10">
              Enter patient health goals, symptoms, or clinical context — and receive an evidence-based supplement formula with ingredients, dosages, and rationale.
            </p>

            {/* Goal pills */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[380px] mb-9">
              {GOALS.map(goal => (
                <button
                  key={goal.label}
                  onClick={() => sendMessage(goal.prompt)}
                  className="
                    px-[18px] py-[9px] rounded-full
                    border border-brand-teal/20 text-brand-teal
                    text-[10.5px] font-bold tracking-[0.12em] uppercase
                    hover:bg-brand-teal hover:text-white hover:border-brand-teal hover:shadow-md hover:shadow-brand-teal/15
                    transition-all duration-150
                  "
                >
                  {goal.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full max-w-[280px] text-gray-200">
              <div className="flex-1 h-px bg-current" />
              <span className="text-[9px] text-brand-charcoal/20 tracking-[0.22em] uppercase whitespace-nowrap">
                or describe your case below
              </span>
              <div className="flex-1 h-px bg-current" />
            </div>

          </div>

        ) : (

          /* ── Chat Messages ───────────────────────────── */
          <div className="px-5 py-7 space-y-5 max-w-2xl mx-auto w-full">
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

      <ChatInput
        value={input}
        onChange={(val) => dispatch({ type: 'SET_INPUT', payload: val })}
        onSend={sendMessage}
        isLoading={isLoading}
      />

    </div>
  );
}
