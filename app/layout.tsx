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
  title: 'Personage — Wellness Advisor',
  description:
    'Personalized vitamins & supplements. Trusted by health professionals, loved by their patients.',
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
