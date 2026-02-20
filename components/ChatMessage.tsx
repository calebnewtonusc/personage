'use client';

import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={i}>{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
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
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-2.5 items-start">
            <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-brand-peach flex-shrink-0" />
            <span className="leading-relaxed"><InlineText text={item} /></span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushList();
      nodes.push(
        <p key={key++} className="mt-3.5 mb-1 text-brand-teal text-[11px] font-bold tracking-[0.18em] uppercase">
          {line.slice(3)}
        </p>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      nodes.push(
        <p key={key++} className="mt-2 mb-0.5 font-semibold text-[13px]">
          <InlineText text={line.slice(4)} />
        </p>
      );
    } else if (/^[-•]\s/.test(line)) {
      listItems.push(line.slice(2).trim());
    } else if (/^\d+\.\s/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s/, '').trim());
    } else if (line.trim() === '') {
      flushList();
      nodes.push(<div key={key++} className="h-1" />);
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

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

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
        className={`max-w-[78%] px-4 py-3 text-[13.5px] leading-relaxed ${
          isUser
            ? 'bg-brand-teal text-white rounded-[18px] rounded-br-[4px]'
            : 'bg-gray-50 border border-gray-100 text-brand-charcoal rounded-[18px] rounded-bl-[4px]'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <BotContent text={message.content} />
        )}

        {isStreaming && !isUser && (
          <span className="inline-block w-[2px] h-3.5 bg-brand-teal/40 align-middle ml-0.5 animate-pulse rounded-full" />
        )}
      </div>

    </div>
  );
}
