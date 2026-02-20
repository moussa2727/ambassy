// app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import { UserCreateSchema } from '@/schemas/user.schema';
import { hash } from 'bcryptjs';
import clientPromise from '@/lib/data/mongo';

// Email qui doit être admin
const ADMIN_EMAIL = process.env.EMAIL_USER;

export async function POST(req: NextRequest) {
  try {
    const body = await (req as any).json();

    // Validation des données
    const validation = UserCreateSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { error: 'Données invalides', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { nom, prenom, telephone, email, pass } = validation.data;

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Vérification si l'email existe déjà
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Hashage du mot de passe
    const hashedPassword = await hash(pass, 10);

    // Détermination du rôle (admin uniquement pour l'email spécifié)
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';

    // Création de l'utilisateur
    const newUser = {
      nom,
      prenom,
      telephone,
      email,
      pass: hashedPassword,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Récupération de l'utilisateur créé (sans le mot de passe)
    const { pass: _, ...createdUser } = newUser;

    return Response.json(
      {
        message: 'Inscription réussie',
        user: {
          ...createdUser,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur register:', error);
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
