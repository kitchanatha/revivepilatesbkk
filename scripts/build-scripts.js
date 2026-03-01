'use strict';

const renderScripts = require('./render-scripts');
const fs = require("fs");
const { loadLang } = require("./i18n");
const pug = require("pug");
const template = pug.compileFile("src/pug/index.pug");
const langs = ["en","th"];

langs.forEach(lang=>{
  const data = loadLang(lang);

  const html = template({
    ...data,
    lang
  });


  // create folder first
  fs.mkdirSync(`dist/${lang}`, { recursive: true });

  fs.writeFileSync(
    `dist/${lang}/index.html`,
    html
  );
});
renderScripts();