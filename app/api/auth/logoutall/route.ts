import { authenticate, clearAuthCookies } from "@/lib/auth"
import { getUsersCollection } from "@/lib/mongo"
import type { ApiResponse } from "@/types"

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

export async function POST(request: Request): Promise<Response> {
  try {
    // Authentifier l'utilisateur
    const auth = await authenticate(request)

    if (!auth.success) {
      return createResponse({
        message: auth.error || "Non autorisé"
      }, 401)
    }

    // Seul l'admin peut déconnecter toutes les sessions
    if (auth.user!.role !== 'admin') {
      return createResponse({
        message: "Accès réservé aux administrateurs"
      }, 403)
    }

    const usersCollection = await getUsersCollection()

    // Supprimer tous les refresh tokens de tous les utilisateurs
    await usersCollection.updateMany(
      { refresh_token: { $ne: null } },
      {
        $set: {
          refresh_token: null,
          updatedAt: new Date()
        }
      }
    )

    // Supprimer les cookies de l'utilisateur courant
    await clearAuthCookies()

    return createResponse({
      message: "Toutes les sessions ont été déconnectées avec succès"
    })

  } catch (err: any) {
    console.error("Erreur lors de la déconnexion globale:", err)
    return createResponse({
      message: "Erreur lors de la déconnexion globale"
    }, 500)
  }
}

export async function OPTIONS(): Promise<Response> {
  return createResponse({ message: "OK" }, 200)
}
