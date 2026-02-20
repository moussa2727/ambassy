// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongo';
import { rateLimit } from '@/lib/rateLimit';
import { LoginSchema } from '@/schemas/index';

// Configuration du rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 tentatives
  identifier: 'login',
});

export async function POST(req: NextRequest) {
  try {
    // Vérifier le rate limiting
    const rateLimitResult = await loginLimiter(req);

    if (!rateLimitResult.success) {
      return Response.json(
        {
          error: 'Trop de tentatives de connexion',
          message: `Veuillez attendre ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)} minutes avant de réessayer`,
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    const body = await req.json();

    // Validation des données
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { error: 'Données invalides', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, pass } = validation.data;

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Recherche de l'utilisateur
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return Response.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérification du mot de passe
    const isValidPassword = await compare(pass, user.pass);
    if (!isValidPassword) {
      return Response.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Création des tokens
    const accessToken = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = sign(
      { userId: user._id.toString() },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Sauvegarde du refresh token en base
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken,
          lastLogin: new Date(),
        },
      }
    );

    // Configuration des cookies
    const cookieStore = await cookies();

    // Access token (httpOnly, secure)
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    // Refresh token (httpOnly, secure)
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/',
    });

    // Retourne les informations utilisateur (sans le mot de passe)
    const { pass: _, refreshToken: __, ...userWithoutSensitive } = user;

    return Response.json({
      message: 'Connexion réussie',
      user: userWithoutSensitive,
    });
  } catch (error) {
    console.error('Erreur login:', error);
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
