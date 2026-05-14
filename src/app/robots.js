export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/tool/', '/category/', '/blog/'],
                disallow: [
                    '/admin',
                    '/dashboard',
                    '/settings',
                    '/profile',
                    '/auth',
                    '/reset-password',
                    '/api/',
                ],
            },
        ],
        sitemap: 'https://www.hubly-tools.com/sitemap.xml',
    };
}
