'use strict';

module.exports = function (context) {
  var options = context.options[0] || {};
  var maxDepth = options.maxDepth || 3;
  var startIterator = options.startIterator || 'i';
  var stack = [];

  function check (node) {
    stack.push(node);

    // Make sure that for loops are not nested excessively
    if (stack.length > maxDepth) {
      context.report(node, 'Too many nested for loops.');
    }

    var init = node.init;

    if (init !== null && init.type === 'VariableDeclaration') {
      // Verify that there is 1 initialized variable at most
      if (init.declarations.length > 1) {
        context.report(node, 'Only one variable can be initialized per loop.');
      }

      var declaration = init.declarations[0];

      // Verify that this is a normal variable declaration, not destructuring
      if (declaration.id.type !== 'Identifier') {
        context.report(node, 'Left hand side of initializer must be a single variable.');
      } else {
        var iteratorVar = declaration.id.name;
        var designatedIter = getIteratorVariable(stack.length - 1);

        // Verify that the iterator variable has the expected value
        if (iteratorVar !== designatedIter) {
          context.report(node, 'Expected iterator \'' + designatedIter + '\', but got \'' + iteratorVar + '\'.');
        }
      }
    }

    var update = node.update;

    // Verify that postfix increment/decrement are not used
    if (update && update.type === 'UpdateExpression' && !update.prefix) {
      context.report(node, 'Update to iterator should use prefix operator.');
    }
  }

  function getIteratorVariable (offset) {
    return String.fromCharCode(startIterator.charCodeAt(0) + offset);
  }

  function popStack () {
    stack.pop();
  }

  return {
    'ForStatement': check,
    'ForStatement:exit': popStack
  };
};

module.exports.schema = [
  {
    type: 'object',
    properties: {
      maxDepth: {
        type: 'integer'
      },
      startIterator: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
];

module.exports.esLintRuleName = 'hapi-for-you';
