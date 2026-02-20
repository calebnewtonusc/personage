import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personage — Wellness Advisor',
  description:
    'Chat with Sage, your personal supplement advisor. Get custom vitamin recommendations tailored to your health goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
