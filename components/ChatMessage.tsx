'use client';

import { useState } from 'react';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, partNum) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={`bold-${partNum}`} className="font-semibold">{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={`em-${partNum}`}>{part.slice(1, -1)}</em>;
        return <span key={`text-${partNum}`}>{part}</span>;
      })}
    </>
  );
}

// Splits "Ingredient Name — 400mg" into name + dosage for styled rendering.
// Handles em-dash (—), en-dash (–), and spaced hyphen ( - ).
function parseIngredientLine(text: string): { name: string; dosage: string } | null {
  const match = text.match(/^(.+?)\s[—–-]\s(.+)$/);
  return match ? { name: match[1], dosage: match[2] } : null;
}

function BotContent({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={key++} className="my-2.5 space-y-1.5">
        {listItems.map((item, itemNum) => (
          <li key={`li-${itemNum}`} className="flex gap-2.5 items-start">
            <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-brand-peach flex-shrink-0" />
            <span className="leading-relaxed"><InlineText text={item} /></span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    // H2 — formula title
    if (line.startsWith('## ')) {
      flushList();
      nodes.push(
        <p key={key++} className="mt-3.5 mb-2 text-brand-teal text-[10.5px] font-bold tracking-[0.14em] uppercase">
          {line.slice(3)}
        </p>
      );

    // H3 — ingredient row: try to parse "Name — Dosage"
    } else if (line.startsWith('### ')) {
      flushList();
      const content = line.slice(4);
      const parsed = parseIngredientLine(content);
      if (parsed) {
        nodes.push(
          <div key={key++} className="mt-4 mb-0.5 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[13.5px] text-brand-charcoal">{parsed.name}</span>
            <span className="px-2.5 py-[3px] rounded-full bg-brand-teal/10 border border-brand-teal/15 text-brand-teal text-[10.5px] font-bold tracking-wide">
              {parsed.dosage}
            </span>
          </div>
        );
      } else {
        nodes.push(
          <p key={key++} className="mt-3 mb-0.5 font-semibold text-[13.5px]">
            <InlineText text={content} />
          </p>
        );
      }

    // Horizontal rule — separates formula body from cost/clinical note
    } else if (line.trim() === '---') {
      flushList();
      nodes.push(<hr key={key++} className="my-3.5 border-t border-gray-200" />);

    // Unordered list
    } else if (/^[-•]\s/.test(line)) {
      listItems.push(line.slice(2).trim());

    // Ordered list
    } else if (/^\d+\.\s/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s/, '').trim());

    // Empty line
    } else if (line.trim() === '') {
      flushList();
      nodes.push(<div key={key++} className="h-1" />);

    // Normal paragraph
    } else {
      flushList();
      nodes.push(
        <p key={key++} className="leading-relaxed">
          <InlineText text={line} />
        </p>
      );
    }
  }
  flushList();
  return <div className="text-[13.5px] space-y-0.5">{nodes}</div>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <button
      onClick={handleCopy}
      className="
        mt-3 flex items-center gap-1.5
        text-[9.5px] font-bold tracking-[0.15em] uppercase
        text-brand-charcoal/25 hover:text-brand-teal
        transition-colors duration-150
      "
      title="Copy formula"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy formula
        </>
      )}
    </button>
  );
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isFormula = !isUser && message.content.includes('## Recommended Formula');

  return (
    <div className={`flex gap-2.5 animate-slideUp ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>

      {/* Bot avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-brand-teal flex-shrink-0 mb-0.5 flex items-center justify-center shadow-sm shadow-brand-teal/20">
          <span className="text-white text-[9px] font-bold tracking-widest">P</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`px-4 py-3 text-[13.5px] leading-relaxed ${
          isUser
            ? 'max-w-[78%] bg-brand-teal text-white rounded-[18px] rounded-br-[4px]'
            : isFormula
              ? 'w-full max-w-[92%] bg-gray-50 border border-gray-100 text-brand-charcoal rounded-[18px] rounded-bl-[4px]'
              : 'max-w-[85%] bg-gray-50 border border-gray-100 text-brand-charcoal rounded-[18px] rounded-bl-[4px]'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <>
            <BotContent text={message.content} />
            {isFormula && !isStreaming && (
              <CopyButton text={message.content} />
            )}
          </>
        )}

        {isStreaming && !isUser && (
          <span className="inline-block w-[2px] h-3.5 bg-brand-teal/40 align-middle ml-0.5 animate-pulse rounded-full" />
        )}
      </div>

    </div>
  );
}
