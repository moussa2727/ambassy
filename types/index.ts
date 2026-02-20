import { ObjectId } from 'mongodb';

export * from './blog';

// Types pour les utilisateurs
export interface User {
  _id?: any; // MongoDB ObjectId
  nom: string;
  prenom: string;
  telephone?: string;
  email: string;
  pass: string;
  role: 'user' | 'admin';
  isActive: boolean;
  refresh_token?: string | null;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UserResponse {
  id: string;
  nom: string;
  prenom: string;
  telephone?: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}
export interface Message {
  _id?: ObjectId; // <-- Définir comme ObjectId optionnel
  id?: string; // <-- Garder l'id string pour l'API
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  response: string;
  createdAt: Date;
  updatedAt: Date;
  repliedAt?: Date;
  deletedAt?: Date;
}
// Types pour les tokens
export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

// Types pour l'authentification
export interface AuthUser {
  _id: string;
  email: string;
  role: string;
  nom?: string;
  prenom?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface VerifyResponse {
  authenticated: boolean;
  message?: string;
  userId?: string;
  role?: string;
  email?: string;
  nom?: string;
  prenom?: string;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
