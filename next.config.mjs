/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/faq',
        destination: '/docs',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/docs',
        permanent: true,
      },
      {
        source: '/help',
        destination: '/docs',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/docs/terms',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/docs/privacy',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; frame-src 'self' data: about:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' blob: data: https:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; media-src 'self' blob: data: https:; connect-src 'self' https://uwyidshwfvjlzfgbtmac.supabase.co wss://uwyidshwfvjlzfgbtmac.supabase.co https://api.openrouter.ai https://generativelanguage.googleapis.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
