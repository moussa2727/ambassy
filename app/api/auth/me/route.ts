// app/api/auth/me/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import clientPromise from '@/lib/data/mongo';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return Response.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérification du token
    let decoded;
    try {
      decoded = verify(accessToken, process.env.JWT_ACCESS_SECRET!) as {
        userId: string;
        email: string;
        role: string;
      };
    } catch (error) {
      return Response.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Recherche de l'utilisateur
    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { pass: 0, refreshToken: 0 } } // Exclusion des champs sensibles
    );

    if (!user) {
      return Response.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return Response.json({ user });
  } catch (error) {
    console.error('Erreur me:', error);
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
