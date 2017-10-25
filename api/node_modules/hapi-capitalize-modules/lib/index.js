'use strict';
module.exports = function (context) {
  var message = 'Imported module variable name not capitalized.';
  var globalScopeOnly = context.options[0] === 'global-scope-only';
  var VALID_TOP_LEVEL_PARENTS = [
    'AssignmentExpression',
    'VariableDeclarator',
    'MemberExpression',
    'ExpressionStatement',
    'CallExpression',
    'ConditionalExpression',
    'Program',
    'VariableDeclaration'
  ];


  function isCapitalized (name) {
    var firstChar = name.charAt(0);

    return firstChar === firstChar.toUpperCase();
  }


  function isRequire (node) {
    return node !== null &&
           node.type === 'CallExpression' &&
           node.callee.type === 'Identifier' &&
           node.callee.name === 'require';
  }


  function atTopLevel () {
    return context.getAncestors().every(function (parent) {
      return VALID_TOP_LEVEL_PARENTS.indexOf(parent.type) > -1;
    });
  }


  function check (node) {
    if (globalScopeOnly === true && atTopLevel() === false) {
      return;
    }

    if (node.type === 'VariableDeclarator' &&
        node.id.type === 'Identifier' &&
        isRequire(node.init) &&
        !isCapitalized(node.id.name)) {
      context.report(node, message);
    } else if (node.type === 'AssignmentExpression' &&
               isRequire(node.right) &&
               node.left.type === 'Identifier' &&
               !isCapitalized(node.left.name)) {
      context.report(node, message);
    }
  }


  return {
    AssignmentExpression: check,
    VariableDeclarator: check
  };
};


module.exports.esLintRuleName = 'hapi-capitalize-modules';
