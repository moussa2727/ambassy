'use client';

import AdminSidebar from '@/components/admin/shared/AdminSidebar';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/admin/shared/LoadingSpinner';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Rediriger automatiquement vers /connexion si non authentifié sur les routes gestionnaire
  useEffect(() => {
    if (!loading && !isAuthenticated && pathname.startsWith('/gestionnaire')) {
      router.push('/connexion');
    }
  }, [loading, isAuthenticated, router, pathname]);

  // Afficher le loader pendant l'authentification
  if (loading) {
    return <LoadingSpinner message="Chargement..." icon="settings" />;
  }

  // Si non authentifié et sur une route gestionnaire, le useEffect s'occupera de la redirection
  if (!isAuthenticated && pathname.startsWith('/gestionnaire')) {
    return null;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <main
        className={`flex-1 transition-all duration-300 overflow-x-hidden ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
