'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');
const renderPug = require('./render-pug');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');
const distPath = upath.resolve(upath.dirname(__filename), '../dist');
const indexPug = upath.join(srcPath, 'pug/index.pug');

// index.pug is what used to be the /trial ads-landing page — the team
// decided to make that design the homepage. This site serves it at three
// routes:
//   /      -> English content (duplicate of /en; canonical points to /en)
//   /en    -> English content (canonical language URL)
//   /th    -> Thai content (canonical language URL)
// Each must be rendered with its own language data so hreflang/canonical
// tags and translated copy are actually correct per route — rendering
// once and copying the file (the old behavior) silently left /en and /th
// stale whenever the template or copy changed.
const targets = [
    { lang: 'en', routePath: '/', destPath: 'dist/index.html' },
    { lang: 'en', routePath: '/en', destPath: 'dist/en/index.html' },
    { lang: 'th', routePath: '/th', destPath: 'dist/th/index.html' }
];

targets.forEach(({ lang, routePath, destPath }) => {
    renderPug(indexPug, { lang, routePath, destPath });
});

// The old /trial, /trial/th URLs (ad creatives, shared links, bookmarks)
// still point here — redirect them to the equivalent new homepage route
// instead of 404ing, since that content now lives at /en and /th.
const redirects = [
    { from: upath.join(distPath, 'trial/index.html'), to: 'https://revivepilatesbkk.com/en' },
    { from: upath.join(distPath, 'trial/th/index.html'), to: 'https://revivepilatesbkk.com/th' }
];

redirects.forEach(({ from, to }) => {
    const dir = upath.dirname(from);
    if (!sh.test('-e', dir)) {
        sh.mkdir('-p', dir);
    }
    const html = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="refresh" content="0; url=${to}" />
        <link rel="canonical" href="${to}" />
        <title>Redirecting…</title>
    </head>
    <body>
        <p>This page has moved. If you are not redirected automatically, <a href="${to}">click here</a>.</p>
    </body>
</html>
`;
    fs.writeFileSync(from, html);
    console.log(`### INFO: wrote redirect ${from} -> ${to}`);
});
