import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="h-full flex flex-col bg-brand-cream">

      {/* Header */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-brand-coral/20 px-6 py-4 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">

          {/* Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-brand-teal" />
            <span className="text-brand-teal text-sm font-medium tracking-[0.18em] uppercase select-none">
              Personage
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] tracking-wide text-brand-charcoal/40 uppercase font-medium select-none">
              Advisor online
            </span>
          </div>

        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-hidden w-full max-w-2xl mx-auto flex flex-col">
        <ChatInterface />
      </main>

      {/* Disclaimer */}
      <footer className="flex-shrink-0 bg-white/40 border-t border-brand-coral/10 py-2 text-center">
        <p className="text-[10px] tracking-wide text-brand-charcoal/30 uppercase">
          Wellness guidance only &mdash; not medical advice
        </p>
      </footer>

    </div>
  );
}
