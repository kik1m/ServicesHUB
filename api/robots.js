export default function handler(req, res) {
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /settings
Disallow: /profile
Disallow: /auth
Disallow: /reset-password

Sitemap: https://hubly-tools.com/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robots);
}
