'use client';

import { toast as sonner } from 'sonner';

// Set pour suivre les messages récents et éviter les doublons
const recentToasts = new Set<string>();
const TOAST_DEBOUNCE_TIME = 1000; // 1 seconde

// Vérifier si un toast est un doublon récent
const isRecentDuplicate = (message: string, type: string): boolean => {
  const key = `${type}-${message}`;
  if (recentToasts.has(key)) {
    return true;
  }
  
  recentToasts.add(key);
  // Nettoyer les anciennes entrées après le délai
  setTimeout(() => {
    recentToasts.delete(key);
  }, TOAST_DEBOUNCE_TIME);
  
  return false;
};

export function useToast() {
  return {
    success: (message: string) => {
      if (isRecentDuplicate(message, 'success')) return;
      return sonner.success(message, { 
        id: `success-${Date.now()}-${Math.random()}`,
        duration: 4000,
        position: 'top-right'
      });
    },
    error: (message: string) => {
      if (isRecentDuplicate(message, 'error')) return;
      return sonner.error(message, { 
        id: `error-${Date.now()}-${Math.random()}`,
        duration: 5000,
        position: 'top-right'
      });
    },
    info: (message: string) => {
      if (isRecentDuplicate(message, 'info')) return;
      return sonner.info(message, { 
        id: `info-${Date.now()}-${Math.random()}`,
        duration: 3000,
        position: 'top-right'
      });
    },
    warning: (message: string) => {
      if (isRecentDuplicate(message, 'warning')) return;
      return sonner.warning(message, { 
        id: `warning-${Date.now()}-${Math.random()}`,
        duration: 4000,
        position: 'top-right'
      });
    },
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
