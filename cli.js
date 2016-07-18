#!/usr/bin/env node

const glob = require('glob');

const findUnused = require('./lib/find-unused');

let srcFiles = [];
process.argv.slice(2).forEach(arg => {
  srcFiles = srcFiles.concat(glob.sync(arg));
});

findUnused(srcFiles).forEach(ident => {
  console.log(ident);
});
