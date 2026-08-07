import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'نظام الزعيم لإدارة الأعمال | ERP System',
  description: 'نظام متكامل لإدارة المبيعات، المشتريات، المخزون، الحسابات، والخزينة للتاجر عبدالرحمن الزعيم',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
