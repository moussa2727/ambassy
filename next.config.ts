import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ====================== IMAGE OPTIMIZATION ======================
  images: {
    // Domaines autorisés pour les images externes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],

    // Formats d'image modernes pour meilleure performance
    formats: ['image/avif', 'image/webp'],

    // Tailles d'images adaptatives pour le responsive design
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Autoriser les origines en développement
  allowedDevOrigins: ['http://172.26.0.1', 'http://localhost:3000'],

  // ====================== PERFORMANCE ======================

  // Activation de la compression
  compress: true,

  // ====================== COMPILER OPTIONS ======================
  compiler: {
    // Suppression des console.log en production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ====================== ENVIRONMENT VARIABLES ======================
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // ====================== ERROR HANDLING ======================
  // Désactiver les source maps en production pour la performance
  productionBrowserSourceMaps: false,
};

export default nextConfig;
