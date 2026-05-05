export default function handler(req, res) {
    const robots = `User-agent: *
Allow: /
Allow: /tool/*
Allow: /category/*
Allow: /blog/*
Disallow: /admin
Disallow: /dashboard
Disallow: /settings
Disallow: /profile
Disallow: /auth
Disallow: /reset-password

Sitemap: https://www.hubly-tools.com/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robots);
}
