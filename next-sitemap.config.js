/**
 * next-sitemap configuration
 * Generates sitemap using NEXT_PUBLIC_APP_URL or fallback to localhost.
 */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin/*',
    '/auth/*',
    '/dashboard/*',
    '/settings/*',
    '/api/*',
    '/private/*',
    '/secret/*',
    '/hidden/*',
    '/gestionnaire/*',
    '/gestionnaires/*',
    '/Gestionnaire/*',
    '/Gestionnaires/*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/gestionnaire', '/gestionnaire/*']
      }
    ]
  }
};
