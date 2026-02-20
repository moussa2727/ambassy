// frontend/src/services/auth/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/shared/Toast';

// Types
interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pass: string;
}

interface LoginData {
  email: string;
  pass: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  me: () => Promise<void>;
  getUsers: () => Promise<User[]>;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await me();
      } catch (error) {
        console.error('Erreur vérification auth:', error);
      }
    };

    checkAuth();
  }, []);

  // ==================== REGISTER ====================
  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        // Gestion des erreurs de validation Zod
        if (data.details) {
          const errorMessages = data.details
            .map((err: any) => err.message)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Succès
      success(data.message || 'Inscription réussie !');
      return data;
    } catch (error: any) {
      error(error.message || "Erreur lors de l'inscription");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGIN ====================
  const login = async (credentials: LoginData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const errorMessages = data.details
            .map((err: any) => err.message)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Mettre à jour l'utilisateur
      setUser(data.user);

      // Message de succès personnalisé selon le rôle
      const welcomeMessage =
        data.user.role === 'admin'
          ? 'Bienvenue administrateur !'
          : `Bienvenue ${data.user.prenom} ${data.user.nom} !`;

      success(welcomeMessage);

      return data;
    } catch (error: any) {
      error(error.message || 'Erreur de connexion');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGOUT ====================
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la déconnexion');
      }

      // Réinitialiser l'utilisateur
      setUser(null);

      success(data.message || 'Déconnexion réussie');
    } catch (error: any) {
      error(error.message || 'Erreur lors de la déconnexion');
      throw error;
    }
  };

  // ==================== REFRESH TOKEN ====================
  const refresh = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });


      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré, déconnexion avec toast
          setUser(null);
          error('Session terminée - Veuillez vous reconnecter');
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur refresh:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== GET CURRENT USER ====================
  const me = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          error('Session terminée - Veuillez vous reconnecter');
        }
        setLoading(false);
        return;
      }

      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Erreur me:', error);
      setUser(null);
      setLoading(false);
    }
  };

  // ==================== GET ALL USERS (Admin only) ====================
  const getUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Accès non autorisé - Réservé aux administrateurs');
        }
        if (response.status === 401) {
          throw new Error('Non authentifié');
        }
        throw new Error(
          data.error || 'Erreur lors de la récupération des utilisateurs'
        );
      }

      return data.users;
    } catch (error: any) {
      error(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refresh,
    me,
    getUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
