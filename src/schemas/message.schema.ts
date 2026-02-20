import { z } from 'zod';

/**
 * SCHÉMA MESSAGE
 *
 * Caractéristiques :
 * - Seuls email et message sont obligatoires (selon vos instructions)
 * - Prénom et nom optionnels
 * - Téléphone optionnel
 * - Validation stricte pour l'email
 * - Longueur contrôlée pour le message
 */

// Schéma pour la création d'un message (public)
export const MessageCreateSchema = z.object({
  // Prénom - optionnel
  firstName: z
    .string()
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),

  // Nom de famille - optionnel
  lastName: z
    .string()
    .max(50, 'Le nom ne doit pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),

  // Téléphone - optionnel mais validé si fourni
  phone: z
    .string()
    .max(20, 'Le téléphone ne doit pas dépasser 20 caractères')
    .optional()
    .or(z.literal(''))
    .refine(phone => !phone || /^\+?[1-9]\d{1,14}$/.test(phone), {
      message:
        'Format de téléphone invalide. Utilisez le format international (ex: +212612345678)',
    }),

  // Email - OBLIGATOIRE
  email: z
    .string()
    .email("Format d'email invalide")
    .max(100, "L'email ne doit pas dépasser 100 caractères")
    .transform(email => email.toLowerCase().trim()),

  // Message - OBLIGATOIRE
  message: z
    .string()
    .min(5, 'Le message doit contenir au moins 5 caractères')
    .max(2000, 'Le message ne doit pas dépasser 2000 caractères')
    .transform(msg => msg.trim()),
});

// Schéma pour la mise à jour d'un message (admin seulement)
export const MessageUpdateSchema = z
  .object({
    // ID du message - obligatoire
    id: z.string().length(24, 'ID MongoDB invalide (24 caractères)'),

    // Marquer comme lu - optionnel
    markRead: z.boolean().optional(),

    // Réponse - optionnelle
    response: z
      .string()
      .max(2000, 'La réponse ne doit pas dépasser 2000 caractères')
      .optional()
      .transform(resp => resp?.trim()),
  })
  .refine(
    data => {
      // Au moins une des deux actions doit être spécifiée
      return data.markRead !== undefined || data.response !== undefined;
    },
    {
      message: 'Au moins une action (markRead ou response) doit être spécifiée',
      path: ['markRead', 'response'],
    }
  );

// Schéma pour la validation d'ID message
export const MessageIdSchema = z.object({
  id: z.string().length(24, 'ID MongoDB invalide (24 caractères)'),
});

// Schéma pour la requête/query des messages (admin) - Version corrigée
export const MessageQuerySchemaSimple = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Le numéro de page doit être un nombre')
    .default('1')
    .transform(Number)
    .refine(n => n >= 1, 'Le numéro de page doit être supérieur ou égal à 1'),

  limit: z
    .string()
    .regex(/^\d+$/, 'La limite doit être un nombre')
    .default('20')
    .transform(Number)
    .refine(n => n >= 1 && n <= 100, 'La limite doit être entre 1 et 100'),

  // Filtres avec valeurs par défaut
  filter: z.enum(['all', 'unread', 'unreplied']).nullable().default('all'),

  // Recherche - accepte null et vide
  search: z.string().nullable().optional().default(''),

  showDeleted: z
    .any()
    .transform(val => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') return val.toLowerCase() === 'true';
      if (typeof val === 'number') return val === 1;
      return false;
    })
    .default(false), // FALSE par défaut = exclure les messages supprimés

  // Tri avec valeurs par défaut
  sortBy: z
    .enum(['createdAt', 'email', 'isRead'])
    .nullable()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).nullable().default('desc'),
});

// Schéma pour l'export des messages
export const MessageExportSchema = z.object({
  format: z.enum(['csv', 'json', 'excel']).default('json'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  includeDeleted: z.boolean().default(false),
});

// Schéma pour le comptage statistique
export const MessageStatsSchema = z.object({
  period: z.enum(['today', 'week', 'month', 'year', 'all']).default('month'),
  groupBy: z.enum(['day', 'week', 'month']).optional(),
});

// Types inférés des schémas
export type MessageCreateInput = z.infer<typeof MessageCreateSchema>;
export type MessageUpdateInput = z.infer<typeof MessageUpdateSchema>;
export type MessageIdInput = z.infer<typeof MessageIdSchema>;
export type MessageQuerySimpleInput = z.infer<typeof MessageQuerySchemaSimple>;
export type MessageExportInput = z.infer<typeof MessageExportSchema>;
export type MessageStatsInput = z.infer<typeof MessageStatsSchema>;
