// lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

// Vérifie le token d'accès et retourne les informations de l'utilisateur ou null si non valide
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


// Middleware pour exiger une authentification, avec option de rôles autorisés
export function requireAuth(
  handler: (req: NextRequest, context: { user: AuthUser }) => Promise<Response>,
  allowedRoles?: ('user' | 'admin')[]
) {
  // Une seule déclaration, avec les paramètres corrects
  return async (req: NextRequest, ...args: any[]) => {
    const user = await verifyAuth(req);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return new Response(JSON.stringify({ error: 'Accès non autorisé' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Propagation correcte des arguments
    return handler(req, { ...args, user });
  };
}

// Middleware pour exiger un rôle admin
export const requireAdmin = (handler: (req: NextRequest, context: { user: AuthUser }) => Promise<Response>,
allowedRole: 'admin' = 'admin'
) => {
  return requireAuth(handler, [allowedRole]);
}

// Middleware pour 
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/gestionnaire')) {
    const res = NextResponse.next();
    res.headers.set('x-robots-tag', 'noindex, nofollow');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gestionnaire/:path*'],
};

