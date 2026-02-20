'use client';

import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  BookOpen,
  Globe,
  Newspaper,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence, AnimationGeneratorType } from 'framer-motion';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const IconWrapper = memo(
  ({
    icon: Icon,
    isActive,
    className = '',
  }: {
    icon: React.ElementType;
    isActive: boolean;
    className?: string;
  }) => (
    <Icon
      className={`w-4 h-4 transition-colors duration-200 ${className} ${
        isActive
          ? 'text-emerald-600'
          : 'text-gray-500 group-hover:text-emerald-500'
      }`}
    />
  )
);

IconWrapper.displayName = 'IconWrapper';

export default function AdminSidebar({
  isCollapsed,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const menuItems: MenuItem[] = [
    { href: '/gestionnaire/statistiques', icon: BarChart3, label: 'Stats' },
    { href: '/gestionnaire/mon-profil', icon: User, label: 'Profil' },
    {
      href: '/gestionnaire/messages',
      icon: MessageSquare,
      label: 'Messages',
      badge: unreadCount,
    },
    { href: '/gestionnaire/blog', icon: BookOpen, label: 'Blog' },
    { href: '/gestionnaire/equipe', icon: Users, label: 'Équipe' },
    { href: '/gestionnaire/ambassadeur', icon: Globe, label: 'Ambassadeurs' },
    {
      href: '/gestionnaire/couvertures',
      icon: Newspaper,
      label: 'Couvertures',
    },
  ];

  const getUserRole = useCallback(() => {
    try {
      const cookieMap = new Map(
        document.cookie.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=');
          return [name, decodeURIComponent(value)];
        })
      );
      return cookieMap.get('user_role') || '';
    } catch {
      return '';
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setUserRole(getUserRole());
  }, [getUserRole]);

  // Récupérer le nombre de messages non lus - VERSION CORRIGÉE
  useEffect(() => {
    if (!isMounted) return;

    const fetchUnreadCount = async () => {
      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Éviter les fetchs simultanés
      if (isFetchingRef.current) return;

      // Créer un nouveau controller pour cette requête
      abortControllerRef.current = new AbortController();

      try {
        isFetchingRef.current = true;

        const response = await fetch(
          '/api/messages?page=1&limit=1&filter=unread&showDeleted=false&sortBy=createdAt&sortOrder=desc',
          {
            credentials: 'include',
            method: 'GET',
            signal: abortControllerRef.current.signal,
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Vérifier la structure de la réponse
          const unread = data.data?.stats?.unread ?? 0;
          setUnreadCount(unread);
          console.log('Status:', response.status);
        } else {
          // Log l'erreur mais ne pas mettre à jour le compteur
          console.error(
            ' Erreur API messages:',
            response.status,
            response.statusText
          );

          // Essayer de lire le corps de l'erreur
          try {
            const errorData = await response.json();
            console.error('Détails erreur:', errorData);
          } catch {
            // Ignorer si pas de JSON
          }
        }
      } catch (error: any) {
        // Ignorer les erreurs d'abort
        if (error.name === 'AbortError') {
          console.log('Requête annulée');
          return;
        }
        console.error(' Erreur fetch:', error);
      } finally {
        isFetchingRef.current = false;
        abortControllerRef.current = null;
      }
    };

    // Charger au montage avec un petit délai pour éviter les conflits
    const timeoutId = setTimeout(fetchUnreadCount, 100);

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isMounted]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, [router]);

  // Animations
  const sidebarVariants = {
    expanded: {
      width: 240, // Réduit de 256 à 240
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    collapsed: {
      width: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.1 } },
  };

  const badgeVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        type: 'spring' as AnimationGeneratorType,
        stiffness: 500,
        damping: 25,
      },
    },
    exit: { scale: 0 },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Sidebar principale */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.aside
            key="sidebar"
            initial="expanded"
            animate="expanded"
            exit="collapsed"
            variants={sidebarVariants}
            className="fixed left-0 top-0 h-screen bg-gradient-to-b from-emerald-50 to-white border-r border-emerald-100/80 flex flex-col z-50 shadow-lg shadow-emerald-900/10 overflow-hidden"
          >
            {/* Header avec logo - plus compact */}
            <div className="p-4 border-b border-emerald-100/80 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                  className="flex items-center gap-2.5"
                >
                  <div className="relative">
                    <Link
                      href="/"
                      className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-600/30"
                    >
                      <Shield className="w-5 h-5 text-white" />
                    </Link>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="font-bold text-emerald-900 text-base leading-tight">
                      Dashboard
                    </h1>
                    <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                      Admin
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggle}
                  className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors group"
                  aria-label="Réduire le menu"
                >
                  <ChevronLeft className="w-4 h-4 text-emerald-600" />
                </motion.button>
              </div>
            </div>

            {/* Informations utilisateur - plus compactes */}
            {userRole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 py-3 border-b border-emerald-100/80 bg-emerald-50/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center border border-emerald-200 shadow-sm">
                      {userRole === 'admin' ? (
                        <Shield className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <User className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        userRole === 'admin'
                          ? 'bg-emerald-500'
                          : 'bg-emerald-400'
                      }`}
                    ></div>
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="font-medium text-emerald-900 text-sm truncate">
                      {userRole === 'admin' ? 'Admin' : 'User'}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-emerald-600">
                        en ligne
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation - plus compacte */}
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
              {menuItems.map(item => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');

                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 shadow-sm border-l-2 border-emerald-500'
                          : 'hover:bg-emerald-50/80 text-gray-600 hover:text-emerald-700'
                      }`}
                    >
                      <div className="relative">
                        <IconWrapper icon={item.icon} isActive={isActive} />

                        {/* Badge pour messages non lus - NE S'AFFICHE QUE SI > 0 */}
                        {item.badge && item.badge > 0 && (
                          <motion.span
                            variants={badgeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm shadow-rose-500/30"
                          >
                            {item.badge > 99 ? '99+' : item.badge}
                          </motion.span>
                        )}
                      </div>

                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        className="flex items-center justify-between flex-1 min-w-0"
                      >
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer avec déconnexion - plus compact */}
            <div className="p-3 border-t border-emerald-100/80 bg-white/50 backdrop-blur-sm">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-rose-50/80 hover:bg-rose-100 transition-colors border border-rose-100/50"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                  className="text-sm font-medium text-rose-700"
                >
                  Déconnexion
                </motion.span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bouton toggle seul quand sidebar est rétractée */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            key="toggle-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="fixed left-3 top-3 z-50 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md shadow-emerald-900/30 transition-colors group"
            aria-label="Développer le menu"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-emerald-800 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Menu
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay mobile */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  );
}
