// src/lib/rateLimit.ts

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(options: {
  windowMs: number;
  max: number;
  identifier?: string;
}) {
  const { windowMs, max, identifier = 'default' } = options;

  return async function checkRateLimit(req: Request): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
  }> {
    // Obtenir l'IP ou identifiant unique
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    const key = `${identifier}:${ip}`;

    const now = Date.now();
    const windowStart = now - windowMs;

    // Nettoyer les entrées expirées
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialiser ou incrémenter
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key].count++;
    }

    const current = store[key];
    const success = current.count <= max;
    const remaining = Math.max(0, max - current.count);

    return {
      success,
      limit: max,
      remaining,
      resetTime: current.resetTime,
    };
  };
}

// Nettoyage périodique du store
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Nettoyer chaque minute
