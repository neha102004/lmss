import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { BackendHealthBanner } from '@/components/BackendHealthBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LMS - Learning Management System',
  description: 'Udemy-like learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackendHealthBanner />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
