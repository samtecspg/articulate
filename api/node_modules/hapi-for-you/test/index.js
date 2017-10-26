'use strict';

var Code = require('code');
var ESLint = require('eslint');
var Lab = require('lab');
var HapiForYou = require('../lib');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var RuleTester = ESLint.RuleTester;

Code.settings.truncateMessages = false;

describe('ESLint Rule', function () {
  it('enforces iterator variable naming', function (done) {
    var ruleTester = new RuleTester();
    var valids = [
      {
        code: 'for (var i = 0; i < a.length; ++i) { for (var j = 0; j < b.length; ++j) {} }'
      },
      {
        code: 'for (var j = 0; j < a.length; ++j) { for (var k = 0; k < b.length; ++k) {} }',
        options: [{startIterator: 'j'}]
      },
      {
        code: 'for (var i = 0; i < a.length; ++i) {}; for (var i = 0; i < a.length; ++i) {}'
      },
      {
        code: 'for (;;) {}'
      }
    ];
    var invalids = [
      {
        code: 'for (var j = 0; j < a.length; ++j) {}',
        errors: [{message: 'Expected iterator \'i\', but got \'j\'.'}]
      },
      {
        code: 'for (var i = 0; i < a.length; ++i) {}',
        options: [{startIterator: 'j'}],
        errors: [{message: 'Expected iterator \'j\', but got \'i\'.'}]
      }
    ];

    ruleTester.run(HapiForYou.esLintRuleName, HapiForYou, {
      valid: valids,
      invalid: invalids
    });
    done();
  });

  it('enforces a maximum of one variable initialized per loop', function (done) {
    var ruleTester = new RuleTester();
    var valids = [
      {
        code: 'for (var i = 0; i < a.length; ++i) {}'
      },
      {
        code: 'for (i = 0, j = 1; i < a.length; ++i) {}'
      },
      {
        code: 'for (; i < a.length; ++i) {}'
      }
    ];
    var invalids = [
      {
        code: 'for (var i = 0, j; i < a.length; ++i) {}',
        errors: [{message: 'Only one variable can be initialized per loop.'}]
      },
      {
        code: 'for (var [i] = [0]; i < a.length; ++i) {}',
        ecmaFeatures: {destructuring: true},
        errors: [{message: 'Left hand side of initializer must be a single variable.'}]
      }
    ];

    ruleTester.run(HapiForYou.esLintRuleName, HapiForYou, {
      valid: valids,
      invalid: invalids
    });
    done();
  });

  it('enforces the maximum number of nested for loops', function (done) {
    var ruleTester = new RuleTester();
    var valids = [
      {
        code: 'for (var i = 0; i < a.length; ++i) {}'
      },
      {
        code: 'for (var i = 0; i < a.length; ++i) { for (var j = 0; j < b.length; ++j) { for (var k = 0; k < c.length; ++k) { for (var l = 0; l < d.length; ++l) {} } } }',
        options: [{maxDepth: 4}]
      }
    ];
    var invalids = [
      {
        code: 'for (var i = 0; i < a.length; ++i) { for (var j = 0; j < b.length; ++j) { for (var k = 0; k < c.length; ++k) { for (var l = 0; l < d.length; ++l) {} } } }',
        errors: [{message: 'Too many nested for loops.'}]
      },
      {
        code: 'for (var i = 0; i < a.length; ++i) { for (var j = 0; j < b.length; ++j) {} }',
        options: [{maxDepth: 1}],
        errors: [{message: 'Too many nested for loops.'}]
      }
    ];

    ruleTester.run(HapiForYou.esLintRuleName, HapiForYou, {
      valid: valids,
      invalid: invalids
    });
    done();
  });

  it('prevents post-increment and post-decrement', function (done) {
    var ruleTester = new RuleTester();
    var valids = [
      {
        code: 'for (var i = 0; i < a.length; ++i) {}'
      },
      {
        code: 'for (var i = 0; i < a.length; --i) {}'
      },
      {
        code: 'for (var i = 0; i < a.length; i += 1) {}'
      },
      {
        code: 'for (var i = 0; i < a.length; i = i + 1) {}'
      },
      {
        code: 'for (var i = 0; i < a.length;) {}'
      }
    ];
    var invalids = [
      {
        code: 'for (var i = 0; i < a.length; i++) {}',
        errors: [{message: 'Update to iterator should use prefix operator.'}]
      },
      {
        code: 'for (var i = 0; i < a.length; i--) {}',
        errors: [{message: 'Update to iterator should use prefix operator.'}]
      }
    ];

    ruleTester.run(HapiForYou.esLintRuleName, HapiForYou, {
      valid: valids,
      invalid: invalids
    });
    done();
  });
});
