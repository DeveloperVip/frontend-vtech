import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import UserChatbox from '@/components/chat/UserChatbox';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

//logo cho web//
export const metadata: Metadata = {
  title: 'Vitechs – Thiết bị đào tạo và giáo cụ chuyên nghiệp',
  description: 'Công ty Vitechs cung cấp các giải pháp thiết bị đào tạo và giáo cụ trực quan chuyên nghiệp.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {children}
        <UserChatbox />
      </body>
    </html>
  );
}
