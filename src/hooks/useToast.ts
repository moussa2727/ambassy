import { useToast } from '@/components/ui/Toast';

// Hook personnalisé pour faciliter l'utilisation des toasts
export const useAppToast = () => {
  const { success, error, info, warning } = useToast();

  return {
    // Succès
    success: (message: string) => success(message),

    // Erreurs
    error: (message: string) => error(message),
    networkError: () => error('Erreur réseau. Vérifiez votre connexion.'),
    apiError: (details?: string) =>
      error(`Erreur serveur${details ? `: ${details}` : ''}`),

    // Info
    info: (message: string) => info(message),
    loading: (message: string) => info(message),

    // Warning
    warning: (message: string) => warning(message),

    // Authentification
    authError: () =>
      error('Vous devez être connecté pour accéder à cette page'),
    authSuccess: () => success('Connexion réussie!'),
    logoutSuccess: () => success('Déconnexion réussie'),

    // Actions CRUD
    createSuccess: (item: string) => success(`${item} créé avec succès`),
    updateSuccess: (item: string) => success(`${item} mis à jour avec succès`),
    deleteSuccess: (item: string) => success(`${item} supprimé avec succès`),
    deleteConfirm: (item: string) =>
      warning(`Êtes-vous sûr de vouloir supprimer ${item}?`),

    // Messages
    messageSent: () => success('Message envoyé avec succès'),
    messageError: () => error("Erreur lors de l'envoi du message"),

    // Formulaire
    formError: (field?: string) =>
      error(
        `Veuillez corriger les erreurs dans le formulaire${field ? ` (${field})` : ''}`
      ),
    formSuccess: () => success('Formulaire soumis avec succès'),

    // Navigation
    redirecting: () => info('Redirection en cours...'),

    // Export/Import
    exportSuccess: () => success('Données exportées avec succès'),
    exportError: () => error("Erreur lors de l'export des données"),
    importSuccess: () => success('Données importées avec succès'),
    importError: () => error("Erreur lors de l'import des données"),
  };
};

// Default export for convenience
export default useAppToast;
