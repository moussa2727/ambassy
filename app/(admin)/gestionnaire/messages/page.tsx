'use client';

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/lib/auth/AuthContext';
import React from 'react';

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
  
  // États pour les popovers de confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    messageId: string | null;
    messageCount?: number;
  }>({ isOpen: false, messageId: null });

  // État pour le popover de réponse
  const [replyConfirm, setReplyConfirm] = useState<{
    isOpen: boolean;
    messageId: string | null;
    responseText: string;
  }>({ isOpen: false, messageId: null, responseText: '' });

  // Vérifier l'authentification et le rôle
   React.useEffect(() => {
     if (loading) return;
 
    if (!isAuthenticated) {
      router.push('/connexion');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, loading, router]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((searchTerm: string) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300),
    []
  );

  // Optimized fetchMessages with caching
  const fetchMessages = useCallback(async (silent: boolean = false) => {
    if (!isAuthenticated) return;

    // Prevent concurrent requests
    if (isLoading && !silent) return;

    try {
      if (!silent) setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        filter: filters.filter,
        search: filters.search,
        showDeleted: filters.showDeleted.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`/api/messages?${params}`, {
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }

      const result = await response.json();
      
      setMessages(result.data.messages);
      setStats(result.data.stats);
      setPagination(result.data.pagination);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        if (!silent) {
          toastError(err.message);
        }
      }
    } finally {
      // TOUJOURS réinitialiser le loading, même en mode silent
      setIsLoading(false);
    }
  }, [isAuthenticated, pagination.page, pagination.limit, filters.filter, filters.search, filters.showDeleted, filters.sortBy, filters.sortOrder, toastError]);

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

  // Rafraîchissement automatique toutes les 30 secondes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // Rafraîchissement silencieux sans afficher le loader ni les erreurs
      fetchMessages(true);
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchMessages]);

  // Optimized markAsRead with optimistic updates
  const markAsRead = async (messageId: string, read: boolean = true) => {
    // Optimistic update
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: read } : msg
    ));

    try {
      const response = await fetch(`/api/messages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: messageId, markRead: read }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      // Update stats optimistically
      setStats(prev => ({
        ...prev,
        unread: read ? Math.max(0, prev.unread - 1) : prev.unread + 1
      }));

      success(read ? 'Message marqué comme lu' : 'Message marqué comme non lu');
    } catch (err) {
      // Revert optimistic update on error
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: !read } : msg
      ));
      toastError('Erreur lors de la mise à jour');
    }
  };


  const confirmReply = async () => {
    if (!replyConfirm.messageId || !replyConfirm.responseText) return;

    // Store original state for rollback
    const originalMessage = messages.find(m => m.id === replyConfirm.messageId);
    
    // Optimistic update
    setMessages(prev => prev.map(msg => 
      msg.id === replyConfirm.messageId 
        ? { ...msg, response: replyConfirm.responseText, isReplied: true, isRead: true }
        : msg
    ));

    try {
      setIsResponding(true);

      const response = await fetch(`/api/messages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: replyConfirm.messageId,
          response: replyConfirm.responseText,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      // Update stats optimistically
      setStats(prev => ({
        ...prev,
        unreplied: Math.max(0, prev.unreplied - 1),
        unread: Math.max(0, prev.unread - (originalMessage?.isRead ? 0 : 1))
      }));

      setSelectedMessage(null);
      setResponseText('');
      setReplyConfirm({ isOpen: false, messageId: null, responseText: '' });
      success('Réponse envoyée avec succès');
    } catch (err) {
      // Revert optimistic update on error
      if (originalMessage) {
        setMessages(prev => prev.map(msg => 
          msg.id === replyConfirm.messageId ? originalMessage : msg
        ));
      }
      toastError("Erreur lors de l'envoi de la réponse");
    } finally {
      setIsResponding(false);
    }
  };

  const cancelReply = () => {
    setReplyConfirm({ isOpen: false, messageId: null, responseText: '' });
  };

  const deleteMessage = async (messageId: string) => {
    // Ouvrir le popover de confirmation au lieu du confirm()
    setDeleteConfirm({ isOpen: true, messageId, messageCount: 1 });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.messageId) return;

    // Store original message for rollback
    const originalMessage = messages.find(m => m.id === deleteConfirm.messageId);
    
    // Optimistic update
    setMessages(prev => prev.filter(msg => msg.id !== deleteConfirm.messageId));
    
    // Update stats optimistically
    if (originalMessage) {
      setStats(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        unread: Math.max(0, prev.unread - (originalMessage.isRead ? 0 : 1)),
        unreplied: Math.max(0, prev.unreplied - (originalMessage.isReplied ? 0 : 1))
      }));
    }

    try {
      const response = await fetch(`/api/messages?id=${deleteConfirm.messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      success('Message supprimé avec succès');
      setDeleteConfirm({ isOpen: false, messageId: null });
    } catch (err) {
      // Revert optimistic update on error
      if (originalMessage) {
        setMessages(prev => [...prev, originalMessage]);
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          unread: prev.unread + (originalMessage.isRead ? 0 : 1),
          unreplied: prev.unreplied + (originalMessage.isReplied ? 0 : 1)
        }));
      }
      toastError('Erreur lors de la suppression');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, messageId: null });
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
    // Ouvrir le popover de confirmation pour la suppression groupée
    setDeleteConfirm({ isOpen: true, messageId: null, messageCount: selectedMessages.length });
  };

  const confirmBulkDelete = async () => {
    if (!deleteConfirm.messageCount || deleteConfirm.messageCount === 0) return;

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
      success(`${deleteConfirm.messageCount} message(s) supprimé(s)`);
      setDeleteConfirm({ isOpen: false, messageId: null, messageCount: 0 });
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
    
    // Réinitialiser les heures pour comparer uniquement les jours
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Popover de confirmation de suppression */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-md mx-4 transition-all duration-200 ease-in-out">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {deleteConfirm.messageCount === 1 
                    ? 'Supprimer ce message ?' 
                    : `Supprimer ${deleteConfirm.messageCount} messages ?`
                  }
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Cette action est irréversible. Voulez-vous continuer ?
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={deleteConfirm.messageCount === 1 ? confirmDelete : confirmBulkDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                {deleteConfirm.messageCount === 1 ? 'Supprimer' : 'Supprimer tout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popover de confirmation de réponse */}
      {replyConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-md mx-4 transition-all duration-200 ease-in-out">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiSend className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Envoyer la réponse ?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Confirmez l'envoi de votre réponse au message.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelReply}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmReply}
                disabled={isResponding}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isResponding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>Envoyer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => fetchMessages()}
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
              onChange={e => debouncedSearch(e.target.value)}
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
                          <div className="shrink-0 h-10 w-10 bg-linear-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
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
                              <FiRepeat className="w-3 h-3 shrink-0" />
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
                        <div className="text-xs text-gray-500 truncate max-w-25">
                          {message.email}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <p className="text-xs text-gray-900 line-clamp-1 max-w-37.5">
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
                  onClick={() => {
                    if (selectedMessage && responseText.trim()) {
                      setReplyConfirm({ 
                        isOpen: true, 
                        messageId: selectedMessage.id, 
                        responseText: responseText.trim() 
                      });
                    }
                  }}
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
