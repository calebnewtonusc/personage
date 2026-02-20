import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex-shrink-0 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-9 h-9 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3C8 3 5 6.5 5 10.5c0 3 1.5 5.5 4 7l1 4h4l1-4c2.5-1.5 4-4 4-7C19 6.5 16 3 12 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 leading-tight">Personage</p>
              <p className="text-xs text-sage-600 leading-tight">Sage &middot; Wellness Advisor</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 flex flex-col overflow-hidden max-w-2xl w-full mx-auto">
        <ChatInterface />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-2 text-center flex-shrink-0">
        <p className="text-xs text-gray-400">
          Sage is an AI assistant. Always consult a healthcare provider before starting new supplements.
        </p>
      </footer>
    </div>
  );
}
