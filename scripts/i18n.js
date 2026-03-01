const fs = require("fs");

function loadLang(lang){
  return JSON.parse(
    fs.readFileSync(`src/data/${lang}.json`)
  );
}

module.exports = { loadLang };