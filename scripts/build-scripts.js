'use strict';

// NOTE: this file previously also re-rendered src/pug/index.pug straight to
// dist/en/index.html and dist/th/index.html, without a routePath. It ran
// right after `build:pug` in the `npm run build` chain (see package.json),
// so on every build it silently overwrote build-pug.js's correct output
// with a version missing routePath — breaking the canonical/hreflang tags
// build-pug.js (see its comment) was specifically reworked to fix. Removed;
// build-pug.js is now the only thing that renders index.pug/trial.pug.
const renderScripts = require('./render-scripts');

renderScripts();