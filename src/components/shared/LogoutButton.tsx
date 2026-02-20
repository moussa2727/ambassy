'use client';

import { useAuth } from '@/services/auth/AuthContext';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LogoutButton() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // La redirection est gérée dans le contexte
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Déconnexion...</span>
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </>
      )}
    </button>
  );
}
