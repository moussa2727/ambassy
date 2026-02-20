// lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const token = req.cookies.get('access_token')?.value;
    if (!token) return null;

    try {
      return verify(token, process.env.JWT_ACCESS_SECRET!) as AuthUser;
    } catch (error) {
      // Si token expiré, on pourrait tenter un refresh
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        // Pour simplifier, on retourne simplement null et on laisse le client gérer le refresh
      }
      return null;
    }
  } catch (error) {
    return null;
  }
}

export function requireAuth(
  handler: (req: NextRequest, context: { user: AuthUser }) => Promise<Response>,
  allowedRoles?: ('user' | 'admin')[]
) {
  // Une seule déclaration, avec les paramètres corrects
  return async (req: NextRequest, ...args: any[]) => {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Propagation correcte des arguments
    return handler(req, { ...args, user });
  };
}
