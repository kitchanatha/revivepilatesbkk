'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

const distPath = upath.resolve(upath.dirname(__filename), '../dist');
const siteUrl = 'https://revivepilatesbkk.com';

if (!sh.test('-e', distPath)) {
    sh.mkdir('-p', distPath);
}

// robots.txt — allow everything, point crawlers at the sitemap.
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
fs.writeFileSync(upath.join(distPath, 'robots.txt'), robotsTxt);
console.log('### INFO: wrote dist/robots.txt');

// sitemap.xml — one entry per real route, with hreflang alternates so
// each language variant is declared consistently with the <link> tags in
// src/pug/index.pug. The old /trial, /trial/th routes now just redirect
// (see build-pug.js) and are intentionally left out — a sitemap should
// only list canonical, indexable pages, not redirects.
const routeGroups = [
    {
        routes: ['/', '/en', '/th'],
        alternates: [
            { hreflang: 'en', href: `${siteUrl}/en` },
            { hreflang: 'th', href: `${siteUrl}/th` },
            { hreflang: 'x-default', href: `${siteUrl}/en` }
        ]
    }
];

const urlEntries = routeGroups
    .flatMap(({ routes, alternates }) =>
        routes.map((route) => {
            const loc = `${siteUrl}${route}`;
            const altLinks = alternates
                .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`)
                .join('\n');
            return `  <url>\n    <loc>${loc}</loc>\n${altLinks}\n  </url>`;
        })
    )
    .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries}\n</urlset>\n`;
fs.writeFileSync(upath.join(distPath, 'sitemap.xml'), sitemapXml);
console.log('### INFO: wrote dist/sitemap.xml');
