'use client';

import { toast as sonner } from 'sonner';

// Générateur d'ID unique pour éviter les doublons
let toastId = 0;

export function useToast() {
  return {
    success: (message: string) => {
      toastId++;
      return sonner.success(message, { id: `toast-${toastId}` });
    },
    error: (message: string) => {
      toastId++;
      return sonner.error(message, { id: `toast-${toastId}` });
    },
    info: (message: string) => {
      toastId++;
      return sonner.info(message, { id: `toast-${toastId}` });
    },
    warning: (message: string) => {
      toastId++;
      return sonner.warning(message, { id: `toast-${toastId}` });
    },
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
