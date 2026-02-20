import jwt, { SignOptions } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import type { TokenPayload, Tokens } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '45m'
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
const SECURE_COOKIES = process.env.SECURE_COOKIES === 'true'

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables')
}

// Interface pour les options JWT
interface JwtSignOptions extends SignOptions {
  expiresIn: string | number;
}

export const generateTokens = (userId: string, email: string, role: 'user' | 'admin'): Tokens => {
  const accessTokenOptions: JwtSignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRY
  }

  const refreshTokenOptions: JwtSignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRY
  }

  const accessToken = jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    accessTokenOptions
  )

  const refreshToken = jwt.sign(
    { userId, email, role },
    JWT_REFRESH_SECRET,
    refreshTokenOptions
  )

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  }
}

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as TokenPayload
  } catch {
    return null
  }
}

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET)
    return decoded as TokenPayload
  } catch {
    return null
  }
}

// Fonction pour définir les cookies HTTP-only sécurisés
export const setAuthCookies = async (tokens: Tokens) => { // Ajouté async
  try {
    const cookieStore = await cookies() // Ajouté await
    const secure = SECURE_COOKIES
    const sameSite = 'strict' as const

    cookieStore.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      maxAge: 45 * 60
    })

    cookieStore.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })
  } catch (error) {
    console.error('Error setting auth cookies:', error)
    throw error
  }
}

// Fonction pour supprimer les cookies d'authentification
export const clearAuthCookies = async () => { // Ajouté async
  try {
    const cookieStore = await cookies() // Ajouté await

    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
  } catch (error) {
    console.error('Error clearing auth cookies:', error)
    throw error
  }
}

// Fonction pour obtenir le token depuis les cookies
export const getTokenFromCookies = async (tokenType: 'access' | 'refresh' = 'access'): Promise<string | null> => { // Ajouté async et retour Promise
  try {
    const cookieStore = await cookies() // Ajouté await
    const cookieName = tokenType === 'access' ? 'access_token' : 'refresh_token'
    const token = cookieStore.get(cookieName)?.value

    return token || null
  } catch (error) {
    console.error('Error getting token from cookies:', error)
    return null
  }
}

// Authentification middleware avec support des cookies
export const authenticate = async (request: Request): Promise<{
  success: boolean;
  user?: TokenPayload;
  error?: string;
}> => {
  try {
    // Essayer d'abord les cookies HTTP-only
    const accessToken = await getTokenFromCookies('access') // Ajouté await

    // Fallback sur l'en-tête Authorization (pour compatibilité)
    const authHeader = request.headers.get('Authorization')
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    const token = accessToken || tokenFromHeader

    if (!token) {
      return { success: false, error: 'Token manquant' }
    }

    // CORRECTION : Vérifier que token est une string (pas null)
    if (typeof token !== 'string') {
      return { success: false, error: 'Token invalide' }
    }

    const decoded = verifyAccessToken(token)
    if (!decoded) {
      return { success: false, error: 'Token invalide ou expiré' }
    }

    return { success: true, user: decoded }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Erreur d\'authentification' }
  }
}

// Version alternative avec vérification de type plus stricte
export const authenticateStrict = async (request: Request): Promise<{
  success: boolean;
  user?: TokenPayload;
  error?: string;
}> => {
  try {
    // 1. Vérifier les cookies
    const cookieStore = await cookies() // Ajouté await
    const accessTokenCookie = cookieStore.get('access_token')?.value

    // 2. Vérifier l'en-tête Authorization
    const authHeader = request.headers.get('Authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    // 3. Utiliser le token disponible
    const token = accessTokenCookie || bearerToken

    if (!token || typeof token !== 'string') {
      return { success: false, error: 'Authentification requise' }
    }

    // 4. Vérifier le token
    const decoded = verifyAccessToken(token)
    if (!decoded) {
      return { success: false, error: 'Token invalide ou expiré' }
    }

    return { success: true, user: decoded }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Erreur d\'authentification' }
  }
}

// Middleware pour exiger l'authentification admin
export const requireAdmin = (handler: (request: Request) => Promise<Response>) => {
  return async (request: Request): Promise<Response> => {
    const auth = await authenticate(request)

    if (!auth.success) {
      return new Response(JSON.stringify({
        message: auth.error || 'Non autorisé'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (auth.user?.role !== 'admin') {
      return new Response(JSON.stringify({
        message: 'Accès réservé aux administrateurs'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return handler(request)
  }
}

// Middleware pour exiger l'authentification (utilisateur ou admin)
export const requireAuth = (handler: (request: Request) => Promise<Response>) => {
  return async (request: Request): Promise<Response> => {
    const auth = await authenticate(request)

    if (!auth.success) {
      return new Response(JSON.stringify({
        message: auth.error || 'Non autorisé'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return handler(request)
  }
}

// Vérification de la règle d'un seul administrateur
export const checkSingleAdminRule = async (
  usersCollection: any,
  email: string
): Promise<'user' | 'admin'> => {
  const adminEmail = process.env.EMAIL_USER
  return email === adminEmail ? 'admin' : 'user'
}

// Fonction utilitaire pour extraire le token d'une requête
export const extractTokenFromRequest = async (request: Request): Promise<string | null> => {
  try {
    // 1. Vérifier les cookies
    const cookieStore = await cookies() // Ajouté await
    const accessToken = cookieStore.get('access_token')?.value

    if (accessToken) return accessToken

    // 2. Vérifier l'en-tête Authorization
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7)
    }

    return null
  } catch (error) {
    console.error('Error extracting token:', error)
    return null
  }
}

// Fonction pour obtenir l'utilisateur depuis la requête
export const getUserFromRequest = async (request: Request): Promise<TokenPayload | null> => {
  try {
    const token = await extractTokenFromRequest(request) // Ajouté await

    if (!token) return null

    return verifyAccessToken(token)
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}