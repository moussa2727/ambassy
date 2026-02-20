// Bibliothèque de toast optimisée pour Next.js avec Sonner
import { toast } from 'sonner';

// Export direct de Sonner pour usage dans les composants
export { toast };

// Fonctions utilitaires pour les messages courants
export const showSuccessToast = (message: string) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showErrorToast = (message: string) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

export const showInfoToast = (message: string) => {
  return toast.info(message, {
    duration: 3000,
    position: 'top-right',
  });
};

export const showWarningToast = (message: string) => {
  return toast.warning(message, {
    duration: 4000,
    position: 'top-right',
  });
};

// Toast avec promesse (pour les opérations asynchrones)
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    position: 'top-right',
  });
};

// Toast personnalisé avec action
export const showActionToast = (
  message: string,
  action: {
    label: string;
    onClick: () => void;
  }
) => {
  return toast(message, {
    action,
    position: 'top-right',
    duration: 6000,
  });
};
