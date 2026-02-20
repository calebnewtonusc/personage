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
    'Get a personalized supplement formula tailored to your health goals — trusted by health professionals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${cormorant.variable}`}>
      <body className="h-full antialiased font-sans text-brand-charcoal bg-brand-cream">
        {children}
      </body>
    </html>
  );
}
