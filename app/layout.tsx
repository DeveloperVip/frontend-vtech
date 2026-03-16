import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import UserChatbox from '@/components/chat/UserChatbox';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vitechs – Contact Us',
  description: 'Get in touch with the Vitechs team.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {children}
        <UserChatbox />
      </body>
    </html>
  );
}
