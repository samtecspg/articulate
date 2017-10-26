'use strict';

module.exports = function (context) {
  function check (node) {
    var fnBody = node.body;

    if (fnBody.type === 'ArrowFunctionExpression') {
      context.report(node, 'Arrow function implicitly creates arrow function.');
    }
  }

  return {
    ArrowFunctionExpression: check
  };
};

module.exports.esLintRuleName = 'no-arrowception';
