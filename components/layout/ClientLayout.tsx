'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import UserChatbox from '@/components/chat/UserChatbox';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      {children}
      {!isAdminPage && <UserChatbox />}
    </>
  );
}
