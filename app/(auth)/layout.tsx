// app/(auth)/layout.tsx
'use client';

import { AuthProvider } from '@/services/auth/AuthContext';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <AuthProvider>
      {' '}
      {/* ← Provider uniquement pour les pages d'auth */}
      {children}
    </AuthProvider>
  );
}
