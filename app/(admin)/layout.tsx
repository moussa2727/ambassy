'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { AuthProvider } from '@/services/auth/AuthContext';
import { ReactNode, useState } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <main
        className={`flex-1 transition-all duration-300 overflow-x-hidden ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </main>
    </div>
  );
}
