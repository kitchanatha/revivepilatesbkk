'use strict';
const fs = require('fs');
const upath = require('upath');
const pug = require('pug');
const sh = require('shelljs');
const prettier = require('prettier');

module.exports = function renderPug(filePath) {
    const destPath = filePath.replace(/src\/pug\//, 'dist/').replace(/\.pug$/, '.html');
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);

    // Provide a default language context so templates using i18n keys
    // (services, packages, about, contact, etc.) won't blow up when
    // run through the generic build-pug task. We default to English but
    // you can extend this later if you detect env or filename.
    let pugData = {
        doctype: 'html',
        filename: filePath,
        basedir: srcPath
    };
    try {
        const { loadLang } = require('./i18n');
        const lang = 'en';
        const data = loadLang(lang);
        pugData = Object.assign(pugData, { lang }, data);
    } catch (e) {
        // if something goes wrong loading language, continue without it
        console.warn('warning: failed to load default language data', e.message);
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
