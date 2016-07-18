'use strict';

const fs = require('fs');

const gonzales = require('gonzales-pe');

const { isInDeclaration, traverse } = require('./util');

/**
 * Return an array of names of variables declared in a source file.
 *
 * @param ast - Gonzales' CSS parse tree
 */
function gatherDeclaredVars(ast) {
  const vars = [];
  ast.forEach('declaration', decl => {
    const propNode = decl.first('property');
    if (!propNode) {
      return;
    }

    const varNode = propNode.first('variable');
    if (!varNode) {
      return;
    }

    const ident = varNode.first('ident').content;
    vars.push(ident);
  });
  return vars;
}

/**
 * Return an array of identifiers of variables that are used
 * in a source file.
 */
function gatherUsedVars(ast) {
  const used = new Set();
  traverse(ast, (node, stack) => {
    if (node.type === 'variable') {
      if (!isInDeclaration(stack)) {
        const ident = node.first('ident').content;
        used.add(ident);
      }
    }
  });
  return used;
}

/**
 * Find unused variables in a set of SASS files.
 *
 * @param {Array<string>} srcFiles - List of source file paths
 */
function findUnusedVars(srcFiles) {
  let declaredVars = [];
  let usedVars = new Set();

  srcFiles.forEach(path => {
    const src = fs.readFileSync(path).toString();
    const parseTree = gonzales.parse(src, {syntax: 'scss'});

    declaredVars = declaredVars.concat(gatherDeclaredVars(parseTree));
    gatherUsedVars(parseTree).forEach(ident => usedVars.add(ident));
  });

  return declaredVars.filter(ident => !usedVars.has(ident));
}

module.exports = findUnusedVars;

