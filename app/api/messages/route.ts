import { requireAdmin, AuthUser } from '@/lib/auth/middleware';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/data/mongo';

// Import des services email
import { ApiResponse } from '@/types/index';
import {
  notifyAdminNewMessage,
  confirmMessageToSender,
  sendReplyToSender,
} from '@/services/messages/email';
import {
  MessageQuerySchemaSimple,
  MessageCreateSchema,
  MessageCreateInput,
  MessageUpdateSchema,
  MessageUpdateInput,
  MessageIdSchema,
} from '@/schemas';

// Helper pour obtenir la collection messages
const getMessagesCollection = async () => {
  const client = await clientPromise;
  return client.db().collection('messages');
};

// Helper pour les réponses
const createResponse = <T = any>(
  data: ApiResponse<T>,
  status: number = 200
): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
};

// Helper pour les erreurs
const handleError = (
  error: any,
  customMessage: string = 'Erreur serveur'
): Response => {
  console.error(`${customMessage}:`, error);

  if (error.name === 'ZodError') {
    return createResponse(
      {
        message: 'Données invalides',
        errors:
          error.errors?.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })) || [],
      },
      400
    );
  }

  return createResponse(
    {
      message: customMessage,
      errors:
        process.env.NODE_ENV === 'production'
          ? [{ field: 'server', message: error.message }]
          : undefined,
    },
    500
  );
};

// GET - Récupérer les messages (admin) avec pagination et filtres
export const GET = requireAdmin(async (req: NextRequest, context: { user: AuthUser }): Promise<Response> => {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Validation unique avec le schéma
    const queryParams = MessageQuerySchemaSimple.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      filter: searchParams.get('filter'),
      search: searchParams.get('search'),
      showDeleted: searchParams.get('showDeleted'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    });

    const messagesCollection = await getMessagesCollection();
    // Optionally test DB connection (silent in production)
    try {
      await messagesCollection.countDocuments();
    } catch (error) {
      console.error('Erreur de connexion MongoDB:', error);
    }

    // 2. Construction du filtre basée sur les types inférés
    let query: any = {};

    // Gestion des supprimés - directement depuis le schéma déjà transformé
    if (queryParams.showDeleted === true) {
      // Afficher SEULEMENT les messages supprimés
      query.deletedAt = { $exists: true, $ne: null };
    } else {
      // Afficher SEULEMENT les messages non supprimés (par défaut)
      query.deletedAt = null;
    }

    // Filtrage par statut - utilisation des valeurs typées
    switch (queryParams.filter) {
      case 'unread':
        query.isRead = false;
        break;
      case 'unreplied':
        query.isReplied = false;
        break;
      // 'all' n'ajoute pas de filtre
    }

    // Recherche textuelle
    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search, 'i');
      query.$or = [
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { message: searchRegex },
        { response: searchRegex },
      ];
    }

    // 3. Options de tri typées
    const sortOptions: any = {
      [queryParams.sortBy as string]: queryParams.sortOrder === 'desc' ? -1 : 1,
    };

    // 4. Pagination avec les valeurs typées
    const skip = (queryParams.page - 1) * queryParams.limit;

    // 5. Exécution des requêtes parallélisées
    

    const [messages, totalMessages, unreadCount, unrepliedCount] =
      await Promise.all([
        messagesCollection
          .find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(queryParams.limit)
          .toArray(),
        messagesCollection.countDocuments(query),
        messagesCollection.countDocuments({ ...query, isRead: false }),
        messagesCollection.countDocuments({ ...query, isReplied: false }),
      ]);

    

    // 6. Formatage de la réponse avec les types inférés
    const totalPages = Math.ceil(totalMessages / queryParams.limit);

    const messagesResponse = messages.map((msg: any) => ({
      ...msg,
      id: msg._id.toString(),
      _id: undefined,
    }));

    return createResponse({
      message: 'Messages récupérés avec succès',
      data: {
        messages: messagesResponse,
        stats: {
          total: totalMessages,
          unread: unreadCount,
          unreplied: unrepliedCount,
        },
        pagination: {
          page: queryParams.page,
          limit: queryParams.limit,
          total: totalMessages,
          totalPages,
          hasNextPage: queryParams.page < totalPages,
          hasPrevPage: queryParams.page > 1,
        },
      },
    });
  } catch (err: any) {
    return handleError(err, 'Erreur lors de la récupération des messages');
  }
});

// POST - Créer un nouveau message (public) avec notifications email
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = MessageCreateSchema.parse(body) as MessageCreateInput;

    const messagesCollection = await getMessagesCollection();

    // Création du message
    const messageData = {
      firstName: validatedData.firstName || '',
      lastName: validatedData.lastName || '',
      phone: validatedData.phone || '',
      email: validatedData.email,
      message: validatedData.message,
      isRead: false,
      isReplied: false,
      response: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null, // <-- CORRECTION : null au lieu de undefined
    };

    

    const result = await messagesCollection.insertOne(messageData as any);

    const messageId = result.insertedId.toString();

    // ========== NOTIFICATIONS EMAIL ==========

    // 1. NOTIFIER L'ADMIN (message reçu)
    try {
      await notifyAdminNewMessage({
        messageId,
        firstName: validatedData.firstName || '',
        lastName: validatedData.lastName || '',
        phone: validatedData.phone || '',
        email: validatedData.email,
        message: validatedData.message,
        createdAt: new Date(),
      });
      
    } catch (emailError: any) {
      console.error('Erreur notification admin:', emailError.message);
    }

    // 2. CONFIRMER À L'EXPÉDITEUR (accusé de réception)
    try {
      const recipientName =
        [validatedData.firstName, validatedData.lastName]
          .filter(Boolean)
          .join(' ') || 'Cher(e) visiteur(e)';

      await confirmMessageToSender({
        messageId,
        recipientEmail: validatedData.email,
        recipientName,
      });
      
    } catch (emailError: any) {
      console.error('Erreur confirmation expéditeur:', emailError.message);
    }
    // ========== FIN NOTIFICATIONS EMAIL ==========

    return createResponse(
      {
        message:
          'Message envoyé avec succès. Vous recevrez une confirmation par email.',
        data: {
          id: messageId,
          email: messageData.email,
          createdAt: messageData.createdAt,
        },
      },
      201
    );
  } catch (err: any) {
    console.error('=== ERREUR dans POST /api/messages ===');
    console.error('Message:', err.message);
    return handleError(err, "Erreur lors de l'envoi du message");
  }
}

// PATCH - Mettre à jour un message (admin seulement) avec envoi de réponse par email
export const PATCH = requireAdmin(
  async (req: NextRequest, context: { user: AuthUser }): Promise<Response> => {
    try {
    const body = await (req as unknown as Request).json();

      // Validation des données
      const validatedData = MessageUpdateSchema.parse(
        body
      ) as MessageUpdateInput;

      const messagesCollection = await getMessagesCollection();

      // Vérifier si le message existe
      const existingMessage = await messagesCollection.findOne({
        _id: new ObjectId(validatedData.id),
      } as any);

      if (!existingMessage) {
        return createResponse(
          {
            message: 'Message introuvable',
          },
          404
        );
      }

      if (existingMessage.deletedAt) {
        return createResponse(
          {
            message: 'Message introuvable',
          },
          404
        );
      }

      

      // Préparer les données de mise à jour
      const updateData: any = { updatedAt: new Date() };

        if (validatedData.markRead !== undefined) {
        updateData.isRead = validatedData.markRead;
      }

      if (validatedData.response !== undefined) {
      updateData.response = validatedData.response;
      updateData.isReplied = true;
      updateData.repliedAt = new Date();
      // Marquer automatiquement comme lu lorsqu'on répond
      updateData.isRead = true;

        // ========== ENVOI DE LA RÉPONSE PAR EMAIL ==========
        try {
          const recipientName =
            [existingMessage.firstName, existingMessage.lastName]
              .filter(Boolean)
              .join(' ') || 'Cher(e) visiteur(e)';

          await sendReplyToSender({
            recipientEmail: existingMessage.email,
            recipientName,
            originalMessage: existingMessage.message,
            adminReply: validatedData.response,
          });
          
        } catch (emailError: any) {
          console.error('Erreur envoi réponse par email:', emailError.message);
          return createResponse({
            message: "Message mis à jour mais échec de l'envoi de l'email",
            data: {
              updated: 1,
              isRead: true,
              isReplied: true,
              emailError: emailError.message,
            },
          });
        }
        // ========== FIN ENVOI EMAIL ==========
      }

      

      // Mettre à jour dans la base
      const result = await messagesCollection.updateOne(
        { _id: new ObjectId(validatedData.id) } as any,
        { $set: updateData }
      );

      

      if (result.matchedCount === 0) {
        return createResponse(
          {
            message: 'Message introuvable',
          },
          404
        );
      }

      const responseMessage =
        validatedData.response !== undefined
          ? 'Réponse envoyée avec succès et message mis à jour'
          : 'Message mis à jour avec succès';

      return createResponse({
        message: responseMessage,
        data: {
          updated: result.modifiedCount,
          isRead: updateData.isRead,
          isReplied: updateData.isReplied || existingMessage.isReplied,
        },
      });
    } catch (err: any) {
      console.error('=== ERREUR dans PATCH /api/messages ===');
      console.error('Message:', err.message);
      console.error('Stack:', err.stack);
      return handleError(err, 'Erreur lors de la mise à jour du message');
    }
  }
);

// DELETE - Version améliorée (optionnelle)
export const DELETE = requireAdmin(
  async (req: NextRequest, context: { user: AuthUser }): Promise<Response> => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const permanent = searchParams.get('permanent') === 'true'; // Optionnel

      if (!id) {
        return createResponse({ message: 'ID du message requis' }, 400);
      }

      const validatedData = MessageIdSchema.parse({ id });
      const messagesCollection = await getMessagesCollection();

      const existingMessage = await messagesCollection.findOne({
        _id: new ObjectId(validatedData.id),
      } as any);

      if (!existingMessage) {
        return createResponse({ message: 'Message introuvable' }, 404);
      }

      if (permanent) {
        // Suppression physique (admin seulement)
        await messagesCollection.deleteOne({
          _id: new ObjectId(validatedData.id),
        } as any);
        return createResponse({ message: 'Message supprimé définitivement' });
      } else {
        // Soft delete (par défaut)
        await messagesCollection.updateOne(
          { _id: new ObjectId(validatedData.id) } as any,
          { $set: { deletedAt: new Date(), updatedAt: new Date() } }
        );
        return createResponse({ message: 'Message supprimé (soft delete)' });
      }
    } catch (err: any) {
      return handleError(err, 'Erreur lors de la suppression');
    }
  }
);

// OPTIONS - Pour le CORS
export async function OPTIONS(): Promise<Response> {
  return createResponse({ message: 'OK' }, 200);
}
