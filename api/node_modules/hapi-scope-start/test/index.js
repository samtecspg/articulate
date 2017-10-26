'use strict';

var Code = require('code');
var ESLint = require('eslint');
var Lab = require('lab');
var HapiScopeStart = require('../lib');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var RuleTester = ESLint.RuleTester;

Code.settings.truncateMessages = false;

describe('ESLint Rule', function () {
  it('reports warning when function body does not begin with a blank line', function (done) {
    var ruleTester = new RuleTester();
    var fns = [
      /* eslint-disable */
      function fn () {
        return;
      },
      function fn (foo, bar, baz) {
        var fizz = 1;
      },
      function fn (foo)

      {
          return 'foo';
      },
      function fn () {/*test*/
        return;
      },
      function fn () { return; },
      function fn (foo, bar, baz) { return; }
      /* eslint-enable */
    ];

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: [],
      invalid: fns.map(function (fn) {
        return {
          code: fn.toString(),
          errors: [{message: 'Missing blank line at beginning of function.'}]
        };
      })
    });
    done();
  });

  it('does not report anything when function body begins with a blank line', function (done) {
    var ruleTester = new RuleTester();
    var fns = [
      /* eslint-disable */
      function fn () {

        return;
      },
      function fn (foo, bar, baz) {

        var fizz = 1;
      },
      function fn (foo)
      {

          return 'foo';
      },
      function fn () {/*test*/

        return;
      }
      /* eslint-enable */
    ];

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: fns.map(function (fn) {
        return {code: fn.toString()};
      }),
      invalid: []
    });
    done();
  });

  it('does not report anything when function is one line and allow-one-liners is set', function (done) {
    var ruleTester = new RuleTester();
    var fns = [
      function fn () { return; },
      function fn (foo, bar, baz) { return; }
    ];

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: fns.map(function (fn) {
        return {
          code: fn.toString(),
          options: ['allow-one-liners']
        };
      }),
      invalid: []
    });
    done();
  });

  it('reports an error when function is allow-one-liners is set but function body contains too many statements', function (done) {
    var ruleTester = new RuleTester();
    var fns = [
      function fn () { var i = 0; i++; return; }
    ];

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: [],
      invalid: fns.map(function (fn) {
        return {
          code: fn.toString(),
          options: ['allow-one-liners', 2],
          errors: [{message: 'Missing blank line at beginning of function.'}]
        };
      })
    });
    done();
  });

  it('allow-one-liners defaults to 1', function (done) {
    var ruleTester = new RuleTester();
    var fns = [
      function fn () { console.log('broken'); return; }
    ];

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: [],
      invalid: fns.map(function (fn) {
        return {
          code: fn.toString(),
          options: ['allow-one-liners'],
          errors: [{message: 'Missing blank line at beginning of function.'}]
        };
      })
    });
    done();
  });

  it('does not report anything when function body is empty', function (done) {
    var ruleTester = new RuleTester();
    var fns = [
      /* eslint-disable */
      function fn () {},
      function fn (foo, bar, baz) {},
      function fn (foo){

      },
      function fn () {/*test*/}
      /* eslint-enable */
    ];

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: fns.map(function (fn) {
        return {code: fn.toString()};
      }),
      invalid: []
    });
    done();
  });

  it('handles function expressions', function (done) {
    var ruleTester = new RuleTester();
    /* eslint-disable */
    var fnExpr = 'var foo = ' + function () {

      return;
    }.toString();
    /* eslint-enable */

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: [{code: fnExpr}],
      invalid: []
    });
    done();
  });

  it('handles arrow functions', function (done) {
    var ruleTester = new RuleTester();
    var valids = [
      'var foo = () => {\n\nreturn;};',
      'var foo = () => {\n\nreturn;}',
      'var foo = () => 42;',
      'var foo = () => 42\n',
      'var foo = () => ({});',
      'var foo = () => ({})',
      'var foo = () => ({\nbar: 1});',
      'var foo = () => [];',
      'var foo = () => [\n1,\n2];',
      'var foo = (isTrue) ? () => bar()\n: false;',
      'var foo = (isTrue) ? true:\n () => 1;'
    ].map(function (fn) {
      return {
        code: fn,
        ecmaFeatures: {arrowFunctions: true}
      };
    });
    var invalids = [
      'var foo = () => {\nreturn;};',
      'var foo = () => {var foo = 1; return foo;};',
      'var foo = () => {var foo = 1;\nreturn foo;};',
      'var foo = () => \n12;',
      'var foo = () => "1" + \n"2";'
    ].map(function (fn) {
      return {
        code: fn,
        ecmaFeatures: {arrowFunctions: true},
        errors: [{message: 'Missing blank line at beginning of function.'}]
      };
    });

    ruleTester.run(HapiScopeStart.esLintRuleName, HapiScopeStart, {
      valid: valids,
      invalid: invalids
    });
    done();
  });
});
