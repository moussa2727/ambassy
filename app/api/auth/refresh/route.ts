// app/api/auth/refresh/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verify, sign } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/data/mongo';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: 'Refresh token manquant' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Vérification du refresh token
    let decoded;
    try {
      decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        userId: string;
      };
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Refresh token invalide ou expiré' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Vérification que le refresh token correspond à celui en base
    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
      refreshToken,
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Session invalide' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Création d'un nouveau access token
    const newAccessToken = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '45m' }
    );

    // Création de la réponse avec NextResponse au lieu de Response
    // Build Set-Cookie header manually
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
    const cookieValue = `access_token=${newAccessToken}; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=${45 * 60}`;

    return new Response(JSON.stringify({ message: 'Token rafraîchi avec succès' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieValue,
      },
    });
  } catch (error) {
    console.error('Erreur refresh:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
