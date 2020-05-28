"use strict";

const fs = require("fs");

const postCssScss = require("postcss-scss");

function visitInterpolations(expression, callback) {
  let pos = 0;
  while ((pos = expression.indexOf("#{", pos)) !== -1) {
    // Find matching `}`.
    let braceLevel = 0;
    let end = pos;
    for (; end < expression.length; end++) {
      if (expression[end] === "{") {
        ++braceLevel;
      } else if (expression[end] === "}") {
        --braceLevel;
        if (braceLevel <= 0) {
          break;
        }
      }
    }

    // Pass interpolated expression to callback.
    callback(expression.slice(pos + 2, end));

    pos = end + 1;
  }
}

function visitSassExpressions(rootNode, callback) {
  rootNode.walk((node) => {
    switch (node.type) {
      case "decl":
        callback(node.value);
        visitInterpolations(node.prop, callback);
        break;
      case "rule":
        visitInterpolations(node.selector, callback);
        break;
      case "atrule":
        visitInterpolations(node.name, callback);
        if (node.name !== "mixin" && node.name !== "function") {
          callback(node.params);
        }
        break;
    }
  });
}

// Matches a possible mixin name or reference, which may include a module name
// (eg. "some-mixin" or "amodule.some-mixin").
const IDENTIFIER_REGEX = /[a-zA-Z0-9_.-]+/;

function gatherDeclaredVars(rootNode) {
  const vars = [];
  rootNode.walkDecls((decl) => {
    if (!decl.prop.startsWith("$")) {
      return;
    }
    vars.push(decl.prop);
  });
  return vars;
}

function gatherUsedVars(rootNode) {
  const used = new Set();
  visitSassExpressions(rootNode, (expr) => {
    const idents = expr.match(/\$[a-zA-Z-_0-9]+/g);
    if (idents) {
      idents.forEach((id) => used.add(id));
    }
  });
  return used;
}

function gatherDeclaredMixins(rootNode) {
  const idents = [];
  rootNode.walkAtRules("mixin", (rule) => {
    const nameMatch = rule.params.match(IDENTIFIER_REGEX);
    if (!nameMatch) {
      throw new Error("Found mixin with no identifier");
    }
    idents.push(nameMatch[0]);
  });
  return idents;
}

function gatherUsedMixins(rootNode) {
  const idents = [];
  rootNode.walkAtRules("include", (rule) => {
    const nameMatch = rule.params.match(IDENTIFIER_REGEX);
    if (!nameMatch) {
      throw new Error("Found @include with no mixin name");
    }
    const parts = nameMatch[0].split(".");
    const ident = parts[parts.length - 1];
    idents.push(ident);
  });
  return idents;
}

function gatherDeclaredFunctions(rootNode) {
  const idents = [];
  rootNode.walkAtRules("function", (rule) => {
    const nameMatch = rule.params.match(IDENTIFIER_REGEX);
    if (!nameMatch) {
      throw new Error("Found function with no identifier");
    }
    const name = nameMatch[0].trim();
    idents.push(name);
  });
  return idents;
}

function gatherUsedFunctions(rootNode) {
  const idents = [];
  visitSassExpressions(rootNode, (expr) => {
    const functionCalls = expr.match(/[a-zA-Z0-9-]+\(/g);
    if (!functionCalls) {
      return;
    }
    functionCalls.forEach((call) => {
      const funcName = call.slice(0, call.length - 1);
      idents.push(funcName);
    });
  });
  return idents;
}

/**
 * Find unused variables and mixins in a set of SASS files.
 *
 * @param {Array<string>} srcFiles - List of source file paths
 * @param {Function} resolver - Optional. Function that takes a path and returns
 *                   its SASS content. If not specified, `fs.readFileSync` is used.
 */
function findUnused(srcFiles, resolver) {
  const declaredVars = [];
  const usedVars = new Set();

  const declaredMixins = [];
  const usedMixins = new Set();

  const declaredFunctions = [];
  const usedFunctions = new Set();

  srcFiles.forEach((path) => {
    const src = resolver ? resolver(path) : fs.readFileSync(path).toString();
    const rootNode = postCssScss.parse(src);

    declaredVars.push(...gatherDeclaredVars(rootNode));
    gatherUsedVars(rootNode).forEach((ident) => usedVars.add(ident));

    declaredMixins.push(...gatherDeclaredMixins(rootNode));
    gatherUsedMixins(rootNode).forEach((ident) => usedMixins.add(ident));

    declaredFunctions.push(...gatherDeclaredFunctions(rootNode));
    gatherUsedFunctions(rootNode).forEach((ident) => usedFunctions.add(ident));
  });

  const unusedVars = declaredVars.filter((ident) => !usedVars.has(ident));
  const unusedMixins = declaredMixins.filter((ident) => !usedMixins.has(ident));
  const unusedFunctions = declaredFunctions.filter(
    (ident) => !usedFunctions.has(ident)
  );

  return {
    vars: unusedVars,
    mixins: unusedMixins,
    functions: unusedFunctions,
  };
}

module.exports = findUnused;
