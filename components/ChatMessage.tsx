'use client';

import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

function renderContent(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.*$)/gm, '<h2 class="text-sm font-semibold mt-3 mb-1 text-gray-900">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xs font-semibold mt-2 mb-0.5 text-gray-800">$1</h3>')
    .replace(/^- (.*$)/gm, '<li class="ml-4" style="list-style-type:disc">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4" style="list-style-type:decimal">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-1.5 space-y-0.5">$&</ul>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold tracking-wide">S</span>
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-sage-600 text-white rounded-tr-sm'
            : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: renderContent(message.content) }}
          />
        )}
        {isStreaming && !isUser && (
          <span
            className="inline-block w-1.5 h-3.5 bg-sage-400 ml-0.5 align-middle rounded-sm animate-pulse"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
