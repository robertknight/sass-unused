'use strict';

/**
 * Traverse an AST produced by Gonzales and call `cb` for each
 * node.
 *
 * @param ast - Gonzales AST
 * @param cb - Function that receives (node, stack) args where `node`
 *             is the node being visited and `stack` is the stack of AST nodes,
 *             including `node` at the current point.
 * @param _stack
 */
function traverse(ast, cb, _stack) {
  const stack = _stack || [ast];

  cb(ast, stack);

  if (Array.isArray(ast.content)) {
    ast.content.forEach(child => {
      stack.push(child);
      cb(child, stack);
      traverse(child, cb, stack);
      stack.pop();
    });
  }
};

/**
 * Return true if the current node in an AST is a variable declaration.
 *
 * @param stack - Stack of AST nodes.
 */
function isInDeclaration(stack) {
  return stack.slice(-3).map(n => n.type).join('/') ===
    'declaration/property/variable';
}

module.exports = {
  isInDeclaration,
  traverse,
};

