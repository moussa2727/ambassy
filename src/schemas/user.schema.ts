import { z } from 'zod';

/**
 * SCHÉMA UTILISATEUR COMPLET
 *
 * Caractéristiques :
 * - Validation stricte avec messages en français
 * - Champs obligatoires : nom, prenom, email, pass, telephone
 * - Rôle immuable selon l'email défini dans EMAIL_USER
 * - Contrôle de complexité du mot de passe
 * - Format téléphone international
 */

// Schéma de base pour la création d'utilisateur
export const UserCreateSchema = z.object({
  // Nom de famille - obligatoire
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'Le nom ne doit contenir que des lettres, espaces, apostrophes et tirets'
    ),

  // Prénom - obligatoire
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'Le prénom ne doit contenir que des lettres, espaces, apostrophes et tirets'
    ),

  // Téléphone - obligatoire au format international
  telephone: z
    .string()
    .min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres')
    .max(20, 'Le numéro de téléphone ne doit pas dépasser 20 caractères')
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      'Format de téléphone invalide. Utilisez le format international (ex: +212612345678)'
    ),

  // Email - obligatoire et unique
  email: z
    .string()
    .email("Format d'email invalide")
    .max(100, "L'email ne doit pas dépasser 100 caractères")
    .transform(email => email.toLowerCase().trim()),

  // Mot de passe - sécurité renforcée
  pass: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(
      /[@$!%*?&#]/,
      'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&#)'
    ),
});

// Schéma pour la mise à jour d'utilisateur
export const UserUpdateSchema = UserCreateSchema.partial() // Tous les champs optionnels
  .omit({ pass: true }) // Le mot de passe nécessite une validation spéciale
  .extend({
    // ID obligatoire pour l'update
    id: z.string().length(24, 'ID MongoDB invalide (24 caractères)'),

    // Optionnel : nouveau mot de passe
    newPassword: z
      .string()
      .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
      .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
      .regex(
        /[A-Z]/,
        'Le nouveau mot de passe doit contenir au moins une majuscule'
      )
      .regex(
        /[a-z]/,
        'Le nouveau mot de passe doit contenir au moins une minuscule'
      )
      .regex(/\d/, 'Le nouveau mot de passe doit contenir au moins un chiffre')
      .regex(
        /[@$!%*?&#]/,
        'Le nouveau mot de passe doit contenir au moins un caractère spécial'
      )
      .optional(),

    // Optionnel : mot de passe actuel requis pour changer le mot de passe
    currentPassword: z
      .string()
      .min(1, 'Le mot de passe actuel est requis pour changer le mot de passe')
      .optional(),
  })
  .refine(
    data => {
      // Si newPassword est fourni, currentPassword doit aussi être fourni
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Le mot de passe actuel est requis pour changer le mot de passe',
      path: ['currentPassword'],
    }
  );

// Schéma pour la validation d'ID utilisateur
export const UserIdSchema = z.object({
  id: z.string().length(24, 'ID MongoDB invalide (24 caractères)'),
});

// Schéma pour l'authentification (login)
export const LoginSchema = z.object({
  email: z
    .string()
    .email("Format d'email invalide")
    .max(100, "L'email ne doit pas dépasser 100 caractères")
    .transform(email => email.toLowerCase().trim()),

  pass: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères'),
});

// Schéma pour le refresh token
export const RefreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Le refresh token est requis'),
});

// Schéma pour le changement de mot de passe
export const PasswordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),

  newPassword: z
    .string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .regex(
      /[A-Z]/,
      'Le nouveau mot de passe doit contenir au moins une majuscule'
    )
    .regex(
      /[a-z]/,
      'Le nouveau mot de passe doit contenir au moins une minuscule'
    )
    .regex(/\d/, 'Le nouveau mot de passe doit contenir au moins un chiffre')
    .regex(
      /[@$!%*?&#]/,
      'Le nouveau mot de passe doit contenir au moins un caractère spécial'
    ),
});

// Schéma pour la recherche/filtrage d'utilisateurs
export const UserQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Le numéro de page doit être un nombre')
    .default('1')
    .transform(Number)
    .refine(n => n >= 1, 'Le numéro de page doit être supérieur ou égal à 1'),

  limit: z
    .string()
    .regex(/^\d+$/, 'La limite doit être un nombre')
    .default('10')
    .transform(Number)
    .refine(n => n >= 1 && n <= 100, 'La limite doit être entre 1 et 100'),

  search: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z
    .string()
    .transform(val => val === 'true')
    .optional(),
});

// Schéma pour le profil utilisateur (GET /me)
export const UserProfileSchema = UserCreateSchema.partial().omit({
  pass: true,
  email: true,
}); // Email ne peut pas être modifié via ce schéma

// Types inférés des schémas
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type UserIdInput = z.infer<typeof UserIdSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type PasswordUpdateInput = z.infer<typeof PasswordUpdateSchema>;
export type UserQueryInput = z.infer<typeof UserQuerySchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
