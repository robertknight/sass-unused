#!/usr/bin/env node

const glob = require('glob');

const findUnusedVars = require('./lib/find-unused-vars');

let srcFiles = [];
process.argv.slice(2).forEach(arg => {
  srcFiles = srcFiles.concat(glob.sync(arg));
});

findUnusedVars(srcFiles).forEach(ident => {
  console.log(ident);
});
