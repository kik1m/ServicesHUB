/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwyidshwfvjlzfgbtmac.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'tse1.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: '*.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
      {
        protocol: 'https',
        hostname: '*.prism.gg',
      },
      {
        protocol: 'https',
        hostname: 'helios-i.mashable.com',
      },
      {
        protocol: 'https',
        hostname: '*.mashable.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.screenshotone.com',
      },
      {
        // Allow ALL external image sources (tool logos from any domain)
        protocol: 'https',
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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://uwyidshwfvjlzfgbtmac.supabase.co wss://uwyidshwfvjlzfgbtmac.supabase.co https://api.openrouter.ai https://generativelanguage.googleapis.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
