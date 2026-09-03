'use strict';
const fs = require('fs');
const upath = require('upath');
const pug = require('pug');
const sh = require('shelljs');
const prettier = require('prettier');
const { loadLang } = require('./i18n');

/**
 * Render a pug page for a specific language + route.
 *
 * @param {string} filePath - source .pug file, e.g. src/pug/index.pug
 * @param {object} [options]
 * @param {string} [options.lang] - 'en' | 'th'. Defaults to 'en'.
 * @param {string} [options.routePath] - the public URL path this build represents,
 *   e.g. '/', '/en', '/th'. Used for canonical/hreflang tags. Defaults to '/en'.
 * @param {string} [options.destPath] - explicit dist output path. Defaults to the
 *   src/pug -> dist mapping (e.g. src/pug/index.pug -> dist/index.html).
 */
module.exports = function renderPug(filePath, options = {}) {
    const lang = options.lang || 'en';
    const routePath = options.routePath || '/en';
    const destPath = options.destPath || filePath.replace(/src\/pug\//, 'dist/').replace(/\.pug$/, '.html');
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');

    console.log(`### INFO: Rendering ${filePath} [lang=${lang}, route=${routePath}] to ${destPath}`);

    let pugData = {
        doctype: 'html',
        filename: filePath,
        basedir: srcPath
    };
    try {
        const data = loadLang(lang);
        pugData = Object.assign(pugData, { lang, routePath }, data);
    } catch (e) {
        console.warn('warning: failed to load language data for', lang, e.message);
    }

    const html = pug.renderFile(filePath, pugData);

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    const prettified = prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
    });

    fs.writeFileSync(destPath, prettified);
};
