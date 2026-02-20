// app/api/auth/logout/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongo';
import { verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Supprimer le refresh token en base si présent
    if (refreshToken) {
      try {
        // Tentative de décodage sans vérification stricte (au cas où le token serait expiré)
        const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET!, {
          ignoreExpiration: true, // Permet de décoder même les tokens expirés
        }) as { userId: string };

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Supprimer le refresh token uniquement s'il correspond
        await usersCollection.updateOne(
          { _id: new ObjectId(decoded.userId), refreshToken },
          { $unset: { refreshToken: '' } }
        );
      } catch (error) {
        // Token invalide ou malformé - on ignore car on veut quand même déconnecter
        console.error('Erreur lors de la suppression du refresh token:', error);
      }
    }

    // Suppression des cookies (ceci est correct !)
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return Response.json({
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    console.error('Erreur logout:', error);
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
