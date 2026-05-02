import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex flex-col min-h-screen bg-primary text-light">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}