'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiMail,
  FiEye,
  FiEyeOff,
  FiRepeat,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiPhone,
  FiCalendar,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiSend,
  FiRefreshCw,
  FiEdit2,
  FiMessageSquare,
  FiUser,
  FiArrowUp,
  FiArrowDown,
  FiArchive,
  FiInbox,
} from 'react-icons/fi';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/services/auth/AuthContext';

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  response: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
  repliedAt?: string;
  deletedAt?: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  unread: number;
  unreplied: number;
}


export default function AdminMessagesPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const { user, isAuthenticated, loading } = useAuth();

  // État principal
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    
    unread: 0,
    unreplied: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres - Par défaut sur les messages non lus
  const [filters, setFilters] = useState({
    search: '',
    filter: 'unread' as 'all' | 'unread' | 'unreplied',
    showDeleted: false,
    sortBy: 'createdAt' as 'createdAt' | 'email' | 'isRead',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // Pagination - SÉPARÉE des filtres
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // États UI
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'table'>('table');

  // Vérification d'authentification uniquement
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/connexion');
    }
  }, [isAuthenticated, loading, router]);

  // Charger les messages
  const fetchMessages = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        filter: filters.filter,
        search: filters.search,
        showDeleted: filters.showDeleted.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/messages?${params}`, {
        credentials: 'include',
      });

      if (response.status === 403) {
        router.push('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }

      const result = await response.json();
      console.log('Response status:', response.status);

      setMessages(result.data.messages);
      setStats(result.data.stats);
      setPagination(result.data.pagination);
    } catch (err: any) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, router, toastError]);

  // Effet pour les changements de filtres et pagination
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.filter,
    filters.search,
    filters.showDeleted,
    filters.sortBy,
    filters.sortOrder,
    isAuthenticated,
  ]);

  // Rafraîchissement périodique - DÉSACTIVÉ temporairement
  // useEffect(() => {
  // if (!isAuthenticated) return
  //
  // const refreshMessages = async () => {
  //   // Éviter le rafraîchissement si une action est en cours
  //   if (isResponding || actionMessage) return
  //
  //   try {
  //     setIsLoading(true)
  //     setError(null)
  //
  //     const params = new URLSearchParams({
  //       page: pagination.page.toString(),
  //       limit: pagination.limit.toString(),
  //       filter: filters.filter,
  //       search: filters.search,
  //       showDeleted: filters.showDeleted.toString(),
  //       sortBy: filters.sortBy,
  //       sortOrder: filters.sortOrder
  //     })
  //
  //     const response = await fetch(`/api/messages?${params}`, {
  //       credentials: 'include'
  //     })
  //
  //     if (response.status === 403) {
  //       router.push('/')
  //       return
  //     }
  //
  //     if (!response.ok) {
  //       throw new Error('Erreur lors du chargement des messages')
  //     }
  //
  //     const result = await response.json()
  //     setMessages(result.data.messages)
  //     setStats(result.data.stats)
  //     setPagination(result.data.pagination)
  //   } catch (err: any) {
  //     setError(err.message)
  //     toastError(err.message)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  //
  // // Charger au montage
  // refreshMessages()
  //
  // // Rafraîchir toutes les 60 secondes (au lieu de 30)
  // const interval = setInterval(refreshMessages, 60000)
  //
  // return () => clearInterval(interval)
  // }, [isAuthenticated, pagination.page, pagination.limit, filters.filter, filters.search, filters.showDeleted, filters.sortBy, filters.sortOrder, isResponding, actionMessage, router, toastError])

  console.log(
    'Rafraîchissement périodique désactivé pour éviter la boucle infinie'
  );

  // Actions sur les messages
  const markAsRead = async (messageId: string, read: boolean = true) => {
    try {
      const response = await fetch(`/api/messages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: messageId, markRead: read }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      await fetchMessages();
      success(read ? 'Message marqué comme lu' : 'Message marqué comme non lu');
    } catch (err) {
      toastError('Erreur lors de la mise à jour');
    }
  };

  const sendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    try {
      setIsResponding(true);

      const response = await fetch(`/api/messages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedMessage.id,
          response: responseText.trim(),
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      await fetchMessages();
      setSelectedMessage(null);
      setResponseText('');
      success('Réponse envoyée avec succès');
    } catch (err) {
      toastError("Erreur lors de l'envoi de la réponse");
    } finally {
      setIsResponding(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      await fetchMessages();
      success('Message supprimé avec succès');
    } catch (err) {
      toastError('Erreur lors de la suppression');
    }
  };

  const toggleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(m => m.id));
    }
  };

  const bulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedMessages.length} message(s) ?`)) return;

    try {
      await Promise.all(
        selectedMessages.map(id =>
          fetch(`/api/messages?id=${id}`, {
            method: 'DELETE',
            credentials: 'include',
          })
        )
      );
      await fetchMessages();
      setSelectedMessages([]);
      setIsBulkMode(false);
      success(`${selectedMessages.length} message(s) supprimé(s)`);
    } catch (err) {
      toastError('Erreur lors de la suppression multiple');
    }
  };

  const bulkMarkAsRead = async () => {
    try {
      await Promise.all(
        selectedMessages.map(id =>
          fetch(`/api/messages`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, markRead: true }),
          })
        )
      );
      await fetchMessages();
      setSelectedMessages([]);
      setIsBulkMode(false);
      success(`${selectedMessages.length} message(s) marqué(s) comme lus`);
    } catch (err) {
      toastError("Erreur lors de l'opération groupée");
    }
  };

  // Gestion du tri
  const handleSort = (column: 'createdAt' | 'email' | 'isRead') => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
    // Réinitialiser à la page 1 quand on change le tri
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Gestion des filtres - CORRECTION: on ne met PAS page dans filters
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset à la page 1
  };

  // Utilitaires
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getStatusBadge = (message: Message) => {
    if (message.deletedAt) {
      return {
        color: 'bg-gray-100 text-gray-600 border-gray-200',
        icon: FiArchive,
        text: 'Supprimé',
        bg: 'bg-gray-50',
      };
    }
    if (!message.isRead) {
      return {
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: FiEyeOff,
        text: 'Non lu',
        bg: 'bg-red-50',
      };
    }
    if (!message.isReplied) {
      return {
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: FiClock,
        text: 'En attente',
        bg: 'bg-yellow-50',
      };
    }
    return {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: FiCheckCircle,
      text: 'Répondu',
      bg: 'bg-green-50',
    };
  };

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'desc' ? (
      <FiArrowDown className="w-3 h-3 inline ml-1" />
    ) : (
      <FiArrowUp className="w-3 h-3 inline ml-1" />
    );
  };

  // Rendu du loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <FiMail className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-green-600 animate-pulse" />
          </div>
          <p className="mt-4 text-green-700 font-medium">
            Chargement de votre messagerie...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                aria-label="Retour"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>
                    {stats.total} message{stats.total !== 1 ? 's' : ''}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mode groupé */}
              <button
                onClick={() => setIsBulkMode(!isBulkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isBulkMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Mode sélection"
              >
                <FiCheckCircle className="w-5 h-5" />
              </button>

              {/* Vue mobile: basculer liste/tableau */}
              <div className="lg:hidden flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setMobileView('list')}
                  className={`px-3 py-2 text-sm ${
                    mobileView === 'list'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setMobileView('table')}
                  className={`px-3 py-2 text-sm ${
                    mobileView === 'table'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tableau
                </button>
              </div>

              {/* Filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
                title="Filtres"
              >
                <FiFilter className="w-5 h-5" />
                {(filters.filter !== 'unread' ||
                  filters.search ||
                  filters.showDeleted) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Rafraîchir */}
              <button
                onClick={fetchMessages}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                title="Rafraîchir"
              >
                <FiRefreshCw
                  className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mt-4 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par email, nom ou contenu..."
              value={filters.search}
              onChange={e => handleFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Panneau de filtres */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiFilter className="w-4 h-4" />
                Filtres
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtres rapides */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange({ filter: 'unread' })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      filters.filter === 'unread'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    Non lus ({stats.unread})
                  </button>
                  <button
                    onClick={() => handleFilterChange({ filter: 'unreplied' })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      filters.filter === 'unreplied'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  >
                    En attente ({stats.unreplied})
                  </button>
                  <button
                    onClick={() => handleFilterChange({ filter: 'all' })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      filters.filter === 'all'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    Tous
                  </button>
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Affichage
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.showDeleted}
                    onChange={e =>
                      handleFilterChange({ showDeleted: e.target.checked })
                    }
                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  {filters.showDeleted
                    ? 'Afficher uniquement les messages supprimés'
                    : 'Afficher les messages actifs'}
                </label>
              </div>

              {/* Tri */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={e =>
                    handleFilterChange({ sortBy: e.target.value as any })
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="createdAt">Date de création</option>
                  <option value="email">Email</option>
                  <option value="isRead">Statut de lecture</option>
                </select>
              </div>

              {/* Ordre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ordre
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={e =>
                    handleFilterChange({ sortOrder: e.target.value as any })
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="desc">Plus récent d'abord</option>
                  <option value="asc">Plus ancien d'abord</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions groupées */}
      {isBulkMode && selectedMessages.length > 0 && (
        <div className="sticky top-24 z-40 mx-4 sm:mx-6 lg:mx-8 my-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedMessages.length} message(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={bulkMarkAsRead}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
              >
                <FiEye className="w-4 h-4" />
                <span className="hidden sm:inline">Marquer comme lus</span>
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
              <button
                onClick={() => setSelectedMessages([])}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiInbox className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Non lus</p>
                <p className="text-3xl font-bold text-red-900">
                  {stats.unread}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiEyeOff className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">
                  En attente
                </p>
                <p className="text-3xl font-bold text-yellow-900">
                  {stats.unreplied}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Desktop (tableau complet) */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des messages {filters.showDeleted ? 'supprimés' : 'actifs'}
              {messages.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({messages.length} message{messages.length !== 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isBulkMode && (
                    <th scope="col" className="px-6 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selectedMessages.length === messages.length &&
                          messages.length > 0
                        }
                        onChange={selectAllMessages}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Expéditeur
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('isRead')}
                  >
                    <div className="flex items-center">
                      Statut
                      {getSortIcon('isRead')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map(message => {
                  const status = getStatusBadge(message);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={message.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        !message.isRead ? 'bg-red-50/30' : ''
                      }`}
                    >
                      {isBulkMode && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMessages.includes(message.id)}
                            onChange={() => toggleSelectMessage(message.id)}
                            className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {message.firstName || message.lastName
                                ? `${message.firstName} ${message.lastName}`.trim()
                                : 'Anonyme'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FiMail className="w-3 h-3" />
                              {message.email}
                            </div>
                            {message.phone && (
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <FiPhone className="w-3 h-3" />
                                {message.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {message.message}
                          </p>
                          {message.response && (
                            <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                              <FiRepeat className="w-3 h-3 flex-shrink-0" />
                              <span className="line-clamp-1">
                                Réponse: {message.response}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-gray-400" />
                          {formatDate(message.createdAt)}
                        </div>
                        {message.repliedAt && (
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <FiSend className="w-3 h-3" />
                            {formatDate(message.repliedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Répondre"
                          >
                            <FiRepeat className="w-4 h-4" />
                          </button>
                          {!message.isRead ? (
                            <button
                              onClick={() => markAsRead(message.id, true)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Marquer comme lu"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsRead(message.id, false)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Marquer comme non lu"
                            >
                              <FiEyeOff className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Version Tablette (entre 768px et 1024px) */}
      <div className="hidden md:block lg:hidden max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isBulkMode && (
                    <th scope="col" className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selectedMessages.length === messages.length &&
                          messages.length > 0
                        }
                        onChange={selectAllMessages}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expéditeur
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aperçu
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map(message => {
                  const status = getStatusBadge(message);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={message.id} className="hover:bg-gray-50">
                      {isBulkMode && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMessages.includes(message.id)}
                            onChange={() => toggleSelectMessage(message.id)}
                            className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {message.firstName || message.lastName
                            ? `${message.firstName} ${message.lastName}`.trim()
                            : 'Anonyme'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {message.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900 line-clamp-1">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(message.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Répondre"
                          >
                            <FiRepeat className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              markAsRead(message.id, !message.isRead)
                            }
                            className={`p-1.5 rounded ${
                              message.isRead
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {message.isRead ? (
                              <FiEyeOff className="w-4 h-4" />
                            ) : (
                              <FiEye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Version Mobile - Tableau horizontal scrollable */}
      <div className="md:hidden max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base font-semibold text-gray-900">
              Liste des messages {filters.showDeleted ? 'supprimés' : 'actifs'}
              {messages.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({messages.length} message{messages.length !== 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isBulkMode && (
                    <th scope="col" className="px-3 py-2 w-8">
                      <input
                        type="checkbox"
                        checked={
                          selectedMessages.length === messages.length &&
                          messages.length > 0
                        }
                        onChange={selectAllMessages}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    De
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map(message => {
                  const status = getStatusBadge(message);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={message.id} className="hover:bg-gray-50">
                      {isBulkMode && (
                        <td className="px-3 py-2 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMessages.includes(message.id)}
                            onChange={() => toggleSelectMessage(message.id)}
                            className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                        </td>
                      )}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">
                          {message.firstName || message.lastName
                            ? `${message.firstName} ${message.lastName}`.trim()
                            : 'Anonyme'}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[100px]">
                          {message.email}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <p className="text-xs text-gray-900 line-clamp-1 max-w-[150px]">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(message.createdAt).toLocaleDateString(
                            'fr-FR'
                          )}
                        </p>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${status.bg}`}
                          title={status.text}
                        >
                          <StatusIcon
                            className="w-3 h-3"
                            style={{ color: status.color.split(' ')[1] }}
                          />
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Répondre"
                          >
                            <FiRepeat className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              markAsRead(message.id, !message.isRead)
                            }
                            className={`p-1 rounded ${
                              message.isRead
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {message.isRead ? (
                              <FiEyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <FiEye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message si aucun résultat */}
      {messages.length === 0 && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FiInbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun message
            </h3>
            <p className="text-gray-600">
              {filters.showDeleted
                ? 'Aucun message trouvé, même dans la corbeille'
                : filters.filter === 'unread'
                  ? "Vous n'avez aucun message non lu"
                  : filters.filter === 'unreplied'
                    ? 'Tous vos messages ont une réponse'
                    : 'Aucun message pour le moment'}
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between sm:justify-center gap-4">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={!pagination.hasPrevPage || isLoading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page <span className="font-medium">{pagination.page}</span>{' '}
                  sur{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </span>
              </div>

              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={!pagination.hasNextPage || isLoading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="hidden sm:inline">Suivant</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de réponse */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiEdit2 className="w-5 h-5 text-green-600" />
                    Répondre au message
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    à{' '}
                    {selectedMessage.firstName || selectedMessage.lastName
                      ? `${selectedMessage.firstName} ${selectedMessage.lastName}`.trim()
                      : selectedMessage.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setResponseText('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
              {/* Message original */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiMessageSquare className="w-4 h-4 text-gray-400" />
                  Message original :
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">
                    {selectedMessage.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(selectedMessage.createdAt)}
                    </span>
                    {selectedMessage.phone && (
                      <span className="flex items-center gap-1">
                        <FiPhone className="w-3 h-3" />
                        {selectedMessage.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Réponse existante */}
              {selectedMessage.response && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiRepeat className="w-4 h-4 text-blue-500" />
                    Réponse précédente :
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">
                      {selectedMessage.response}
                    </p>
                    {selectedMessage.repliedAt && (
                      <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <FiSend className="w-3 h-3" />
                        Envoyée le {formatDate(selectedMessage.repliedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Formulaire de réponse */}
              <div>
                <label
                  htmlFor="response"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Votre réponse :
                </label>
                <textarea
                  id="response"
                  rows={6}
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Tapez votre réponse ici..."
                  maxLength={2000}
                />
                <div className="mt-2 flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      responseText.length > 1800
                        ? 'text-orange-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {responseText.length}/2000 caractères
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setResponseText('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 order-2 sm:order-1"
                  disabled={isResponding}
                >
                  Annuler
                </button>
                <button
                  onClick={sendResponse}
                  disabled={!responseText.trim() || isResponding}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  {isResponding ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      <span>Envoyer la réponse</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
