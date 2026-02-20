
import { checkSingleAdminRule, requireAdmin } from "@/lib/auth/auth"
import { getUsersCollection } from "@/lib/data/mongo"
import bcrypt from "bcrypt"
import type { ApiResponse, PaginatedResponse, UserResponse } from "@/types"
import { UserQuerySchema, UserCreateSchema, UserUpdateSchema, UserIdSchema } from "@/schemas"
import type { UserCreateInput, UserUpdateInput } from "@/schemas"
import { ObjectId } from "mongodb"

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
  })
}

// Helper pour les erreurs
const handleError = (error: any, customMessage: string = "Erreur serveur"): Response => {
  console.error(`${customMessage}:`, error)

  if (error.name === 'ZodError') {
    return createResponse({
      message: "Données invalides",
      errors: error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }))
    }, 400)
  }

  if (error.code === 11000) {
    return createResponse({
      message: "Cet email est déjà utilisé"
    }, 409)
  }

  if (error.message?.includes("un seul administrateur") ||
    error.message?.includes("Le rôle ne peut pas être modifié") ||
    error.message?.includes("ne peut pas être modifié") ||
    error.message?.includes("ne peut pas être supprimé")) {
    return createResponse({
      message: error.message
    }, 409)
  }

  return createResponse({
    message: customMessage,
    errors: process.env.NODE_ENV === 'development' ? [
      { field: 'server', message: error.message }
    ] : undefined
  }, 500)
}

// GET - Récupérer tous les utilisateurs (admin seulement)
export const GET = requireAdmin(async (request: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(request.url)

    // Valider les paramètres de requête
    const queryParams = UserQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      role: searchParams.get('role'),
      isActive: searchParams.get('isActive')
    })

    const usersCollection = await getUsersCollection()

    // Construire le filtre
    const query: any = { deletedAt: { $exists: false } }

    // Appliquer les filtres optionnels
    if (queryParams.role) {
      query.role = queryParams.role
    }

    if (queryParams.isActive !== undefined) {
      query.isActive = queryParams.isActive
    }

    // Recherche textuelle
    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search, 'i')
      query.$or = [
        { nom: searchRegex },
        { prenom: searchRegex },
        { email: searchRegex },
        { telephone: searchRegex }
      ]
    }

    // Compter le total
    const totalUsers = await usersCollection.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / queryParams.limit)
    const skip = (queryParams.page - 1) * queryParams.limit

    // Récupérer les utilisateurs (exclure les champs sensibles)
    const users = await usersCollection
      .find(query, {
        projection: {
          pass: 0,
          refresh_token: 0
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(queryParams.limit)
      .toArray()

    // Formater la réponse - CORRECTION : Utiliser _id au lieu de id
    const usersResponse: UserResponse[] = users.map(user => ({
      id: user._id!.toString(), // CORRECTION : _id au lieu de id
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone || undefined,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin || undefined, // CORRECTION : null → undefined
      createdAt: user.createdAt
    }))

    const response: PaginatedResponse<UserResponse> = {
      data: usersResponse,
      pagination: {
        page: queryParams.page,
        limit: queryParams.limit,
        total: totalUsers,
        totalPages,
        hasNextPage: queryParams.page < totalPages,
        hasPrevPage: queryParams.page > 1
      }
    }

    return createResponse({
      message: "Utilisateurs récupérés avec succès",
      data: response
    })

  } catch (err: any) {
    return handleError(err, "Erreur lors de la récupération des utilisateurs")
  }
})

// POST - Créer un nouvel utilisateur (admin seulement)
export const POST = requireAdmin(async (request: Request): Promise<Response> => {
  try {
    const body = await request.json()

    // Validation des données
    const validatedData = UserCreateSchema.parse(body) as UserCreateInput

    const usersCollection = await getUsersCollection()

    // Vérifier si l'email existe déjà
    const existingUser = await usersCollection.findOne({
      email: validatedData.email,
      deletedAt: { $exists: false }
    })

    if (existingUser) {
      return createResponse({
        message: "Cet email est déjà utilisé"
      }, 409)
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.pass, 12)

    // Déterminer le rôle selon l'email .env (règle: un seul admin)
    const role = await checkSingleAdminRule(usersCollection, validatedData.email)

    // Créer l'utilisateur - CORRECTION : lastLogin: null au lieu de Date
    const userData = {
      nom: validatedData.nom,
      prenom: validatedData.prenom,
      telephone: validatedData.telephone,
      email: validatedData.email,
      pass: hashedPassword,
      role,
      isActive: true,
      refresh_token: null,
      lastLogin: null, // CORRECTION : null au lieu de Date
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await usersCollection.insertOne(userData)

    // Formater la réponse (sans données sensibles)
    const userResponse: UserResponse = {
      id: result.insertedId.toString(),
      nom: userData.nom,
      prenom: userData.prenom,
      telephone: userData.telephone,
      email: userData.email,
      role: userData.role,
      isActive: userData.isActive,
      lastLogin: userData.lastLogin || undefined, // CORRECTION : null → undefined
      createdAt: userData.createdAt
    }

    return createResponse({
      message: "Utilisateur créé avec succès",
      data: userResponse
    }, 201)

  } catch (err: any) {
    return handleError(err, "Erreur lors de la création de l'utilisateur")
  }
})

// PATCH - Mettre à jour un utilisateur (admin seulement)
export const PATCH = requireAdmin(async (request: Request): Promise<Response> => {
  try {
    const body = await request.json()

    // Validation des données
    const validatedData = UserUpdateSchema.parse(body) as UserUpdateInput

    const usersCollection = await getUsersCollection()

    // Vérifier si l'utilisateur existe - _id 
    const existingUser = await usersCollection.findOne({
      _id: new ObjectId(validatedData.id), // _id
      deletedAt: { $exists: false }
    })

    if (!existingUser) {
      return createResponse({
        message: "Utilisateur introuvable"
      }, 404)
    }

    // Empêcher la modification de l'admin système
    if (existingUser.role === 'admin' && existingUser.email === process.env.EMAIL_USER) {
      return createResponse({
        message: "L'administrateur système ne peut pas être modifié"
      }, 403)
    }

    // Préparer les données de mise à jour
    const updateData: any = { updatedAt: new Date() }

    if (validatedData.nom !== undefined) updateData.nom = validatedData.nom
    if (validatedData.prenom !== undefined) updateData.prenom = validatedData.prenom
    if (validatedData.telephone !== undefined) updateData.telephone = validatedData.telephone

    // Vérifier et mettre à jour l'email si nécessaire
    if (validatedData.email && validatedData.email !== existingUser.email) {
      // Vérifier si le nouvel email n'est pas déjà utilisé
      const emailExists = await usersCollection.findOne({
        email: validatedData.email,
        _id: { $ne: new ObjectId(validatedData.id) }, // CORRECTION : _id
        deletedAt: { $exists: false }
      })

      if (emailExists) {
        return createResponse({
          message: "Cet email est déjà utilisé par un autre utilisateur"
        }, 409)
      }

      updateData.email = validatedData.email
    }

    // Mettre à jour le mot de passe si fourni
    if (validatedData.newPassword && validatedData.currentPassword) {
      // Vérifier le mot de passe actuel
      const isPasswordValid = await bcrypt.compare(
        validatedData.currentPassword,
        existingUser.pass
      )

      if (!isPasswordValid) {
        return createResponse({
          message: "Mot de passe actuel incorrect"
        }, 401)
      }

      // Hasher le nouveau mot de passe
      updateData.pass = await bcrypt.hash(validatedData.newPassword, 12)
    }

    // Mettre à jour dans la base - _id
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(validatedData.id) }, // _id
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return createResponse({
        message: "Utilisateur introuvable"
      }, 404)
    }

    return createResponse({
      message: "Utilisateur mis à jour avec succès",
      data: {
        updated: result.modifiedCount,
        id: validatedData.id
      }
    })

  } catch (err: any) {
    return handleError(err, "Erreur lors de la mise à jour de l'utilisateur")
  }
})

// DELETE - Supprimer un utilisateur (soft delete - admin seulement)
export const DELETE = requireAdmin(async (request: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return createResponse({
        message: "ID de l'utilisateur requis"
      }, 400)
    }

    // Validation de l'ID
    const validatedData = UserIdSchema.parse({ id })

    const usersCollection = await getUsersCollection()

    // Vérifier si l'utilisateur existe - _id
    const existingUser = await usersCollection.findOne({
      _id: new ObjectId(validatedData.id), // _id
      deletedAt: { $exists: false }
    })

    if (!existingUser) {
      return createResponse({
        message: "Utilisateur introuvable"
      }, 404)
    }

    // Empêcher la suppression de l'admin système
    if (existingUser.role === 'admin' && existingUser.email === process.env.EMAIL_USER) {
      return createResponse({
        message: "L'administrateur système ne peut pas être supprimé"
      }, 403)
    }

    // Soft delete - _id
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(validatedData.id) },
      {
        $set: {
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date(),
          refresh_token: null // Invalider la session
        }
      }
    )

    if (result.matchedCount === 0) {
      return createResponse({
        message: "Utilisateur introuvable"
      }, 404)
    }

    return createResponse({
      message: "Utilisateur supprimé avec succès"
    })

  } catch (err: any) {
    return handleError(err, "Erreur lors de la suppression de l'utilisateur")
  }
})

// OPTIONS - Pour le CORS
export async function OPTIONS(): Promise<Response> {
  return createResponse({ message: "OK" }, 200)
}