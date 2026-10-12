import { Geist, Geist_Mono, Newsreader, Caveat } from 'next/font/google';

import { AppProviders } from '@/providers';

import './globals.css';
import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin', 'vietnamese'],
  style: ['normal', 'italic'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: 'Sổ Tay Tài Chính Cá Nhân',
  description:
    'Nền tảng ghi sổ thu chi & quản lý ngân sách phong cách Paperlike',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${caveat.variable} light h-full antialiased`}
      data-theme="light"
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
