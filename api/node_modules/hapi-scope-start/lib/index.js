'use strict';

module.exports = function (context) {
  var allowOneLiners = context.options[0] === 'allow-one-liners';
  var maxInOneLiner = context.options[1] !== undefined ? context.options[1] : 1;

  function checkFunction (node) {
    check(node, allowOneLiners, maxInOneLiner);
  }

  function checkArrow (node) {
    check(node, true, maxInOneLiner);
  }

  function check (node, allowOneLiners, maxInOneLiner) {
    var fnBody = node.body;

    // Arrow functions can return literals that span multiple lines
    if (fnBody.type === 'ObjectExpression' || fnBody.type === 'ArrayExpression') {
      return;
    }

    var isBlockBody = fnBody.type === 'BlockStatement';
    var body = isBlockBody ? fnBody.body : [fnBody];

    // Allow empty function bodies to be of any size
    if (body.length === 0) {
      return;
    }

    var stmt = body[0];
    var bodyStartLine = stmt.loc.start.line;
    var openTokenLine = context.getTokenBefore(stmt).loc.start.line;
    var closeTokenLine = isBlockBody ? context.getTokenAfter(stmt).loc.start.line : context.getLastToken(stmt).loc.start.line;

    if (allowOneLiners === true &&
        body.length <= maxInOneLiner &&
        openTokenLine === closeTokenLine) {
      return;
    }

    if (bodyStartLine - openTokenLine < 2) {
      context.report(node, 'Missing blank line at beginning of function.');
    }
  }

  return {
    ArrowFunctionExpression: checkArrow,
    FunctionExpression: checkFunction,
    FunctionDeclaration: checkFunction
  };
};

module.exports.esLintRuleName = 'hapi-scope-start';
