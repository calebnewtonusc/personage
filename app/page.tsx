import ChatInterface from '@/components/ChatInterface';

const FEATURES = [
  'Evidence-based ingredient rationale',
  'Precise dosages for every formula',
  'Trusted by licensed practitioners',
];

export default function Home() {
  return (
    <div className="h-full flex overflow-hidden bg-white">

      {/* ── Brand Panel (desktop only) ─────────────────── */}
      <aside className="hidden lg:flex w-[400px] xl:w-[440px] flex-shrink-0 bg-brand-teal flex-col relative overflow-hidden">

        {/* Decorative circles */}
        <div aria-hidden className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-white/[0.04]" />
        <div aria-hidden className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-peach/[0.1]" />
        <div aria-hidden className="absolute top-[45%] right-6 w-24 h-24 rounded-full bg-white/[0.03]" />

        <div className="relative z-10 flex flex-col h-full px-10 py-10">

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-white/25 flex-shrink-0" />
            <span className="text-white/70 text-[10px] tracking-[0.28em] uppercase font-bold select-none">
              Personage
            </span>
          </div>

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center py-10">
            <p className="text-brand-peach/60 text-[9px] tracking-[0.3em] uppercase font-bold mb-5 select-none">
              Formula Engine
            </p>
            <h2
              className="font-serif italic text-white font-light leading-[1.08]"
              style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}
            >
              AI-powered.<br />
              <span className="text-brand-peach">Evidence-based.</span><br />
              Personalized.
            </h2>
            <p className="mt-6 text-white/35 text-[12px] leading-relaxed max-w-[230px]">
              Practitioner-grade supplement recommendations with precise dosages and clinical rationale — built for health professionals.
            </p>
          </div>

          {/* Feature list */}
          <div className="border-t border-white/10 pt-7 space-y-4 mb-10">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-[18px] h-[18px] rounded-full border border-brand-peach/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-brand-peach/80" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l2.5 2.5L9 1" />
                  </svg>
                </div>
                <span className="text-white/45 text-[11.5px]">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://personage.com"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start flex items-center gap-2 text-brand-peach/55 text-[10px] tracking-[0.2em] uppercase font-bold hover:text-brand-peach transition-colors duration-150 group select-none"
          >
            Learn about Personage
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>

        </div>
      </aside>

      {/* ── Chat Panel ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">

        {/* Top bar */}
        <div className="flex-shrink-0 border-b border-gray-100 px-6 py-[14px] flex items-center justify-between">
          {/* Mobile: show Personage logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-4 h-4 rounded-full bg-brand-teal flex-shrink-0" />
            <span className="text-brand-teal text-[10px] tracking-[0.25em] uppercase font-bold select-none">
              Personage
            </span>
          </div>
          {/* Desktop: context label */}
          <p className="hidden lg:block text-brand-charcoal/35 text-[11px] tracking-wide select-none">
            AI Formula Recommendation Engine
          </p>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-[9.5px] text-brand-charcoal/30 tracking-[0.2em] uppercase select-none">Online</span>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ChatInterface />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-50 py-[7px] text-center">
          <p className="text-[9px] text-brand-charcoal/20 tracking-[0.2em] uppercase select-none">
            For educational purposes only &mdash; not a substitute for clinical judgment
          </p>
        </div>

      </div>
    </div>
  );
}
