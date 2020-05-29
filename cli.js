#!/usr/bin/env node

const glob = require('glob');

const findUnused = require('./lib/find-unused');

let srcFiles = [];
process.argv.slice(2).forEach(arg => {
  srcFiles = srcFiles.concat(glob.sync(arg));
});

function printUnusedList(type, idents) {
  idents.sort().forEach(ident => console.log(`unused ${type}: ${ident}`));
}

const { vars, mixins, functions } = findUnused(srcFiles);
printUnusedList('variable', vars);
printUnusedList('mixin', mixins);
printUnusedList('functions', functions);

if (vars.length || mixins.length || functions.length) {
  process.exit(1);
} else {
  process.exit(0);
}
