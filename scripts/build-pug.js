'use strict';
const upath = require('upath');
const renderPug = require('./render-pug');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');
const indexPug = upath.join(srcPath, 'pug/index.pug');
const trialPug = upath.join(srcPath, 'pug/trial.pug');

// This site serves the same homepage template at three routes:
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

// Trial-booking / ads landing page. This is its own template (not the
// homepage) so it can drop the full nav and add its own hero/offer/FAQ —
// see src/pug/trial.pug. No '/' duplicate here, just the two language routes.
const trialTargets = [
    { lang: 'en', routePath: '/trial', destPath: 'dist/trial/index.html' },
    { lang: 'th', routePath: '/trial/th', destPath: 'dist/trial/th/index.html' }
];

targets.forEach(({ lang, routePath, destPath }) => {
    renderPug(indexPug, { lang, routePath, destPath });
});

trialTargets.forEach(({ lang, routePath, destPath }) => {
    renderPug(trialPug, { lang, routePath, destPath });
});
