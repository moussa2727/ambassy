// app/api/users/route.ts
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import clientPromise from '@/lib/mongo';

const getUsers = async (req: NextRequest, context: { user: any }) => {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const users = await usersCollection
      .find({}, { projection: { pass: 0, refreshToken: 0 } })
      .toArray();

    return Response.json({ users });
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
};

// Route protégée accessible uniquement aux admins
export const GET = requireAuth(getUsers, ['admin']);
