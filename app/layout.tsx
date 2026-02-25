import type { Metadata } from 'next';
import { Cormorant } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Personage — AI Formula Engine',
  description:
    'AI-powered supplement formula recommendations for practitioners. Input health goals or clinical context and receive evidence-based ingredient and dosage protocols.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${cormorant.variable}`}>
      <body className="h-full antialiased font-sans text-brand-charcoal bg-white">
        {children}
      </body>
    </html>
  );
}
