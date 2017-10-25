'use strict';
var Code = require('code');
var ESLint = require('eslint');
var Lab = require('lab');
var HapiCapitalizeModules = require('../lib');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var RuleTester = ESLint.RuleTester;

Code.settings.truncateMessages = false;

describe('ESLint Rule', function () {
  it('reports warning when module is not capitalized', function (done) {
    var ruleTester = new RuleTester();
    var code = [
      'var hapi = require("hapi");',
      'var poop; poop = require("poop");',
      'var foo = {bar: function() { var hapi = require("hapi"); }};'
    ];

    ruleTester.run(HapiCapitalizeModules.esLintRuleName, HapiCapitalizeModules, {
      valid: [],
      invalid: code.map(function (code) {
        return {
          code: code,
          errors: [{message: 'Imported module variable name not capitalized.'}]
        };
      })
    });
    done();
  });

  it('does not report anything if module variable is capitalized', function (done) {
    var ruleTester = new RuleTester();
    var code = [
      'var Hapi = require("hapi");',
      'var Poop; Poop = require("poop");',
      'Code = require("code");'
    ];

    ruleTester.run(HapiCapitalizeModules.esLintRuleName, HapiCapitalizeModules, {
      valid: code.map(function (code) {
        return {code: code};
      }),
      invalid: []
    });
    done();
  });

  it('only warns on globals when global-scope-only is set', function (done) {
    var ruleTester = new RuleTester();
    var valid = [
      'function foo() { var hapi = require("hapi"); }',
      'var foo = function() { var hapi = require("hapi"); }',
      'var foo = {bar: function() { hapi = require("hapi"); }};'
    ];
    var invalid = [
      'hapi = require("hapi");',
      'var poop; poop = require("poop");'
    ];

    ruleTester.run(HapiCapitalizeModules.esLintRuleName, HapiCapitalizeModules, {
      valid: valid.map(function (code) {
        return {
          code: code,
          options: ['global-scope-only']
        };
      }),
      invalid: invalid.map(function (code) {
        return {
          code: code,
          options: ['global-scope-only'],
          errors: [{message: 'Imported module variable name not capitalized.'}]
        };
      })
    });
    done();
  });

  it('global-scope-only works in the presense of ES6 modules', function (done) {
    var ruleTester = new RuleTester();
    var invalid = [
      'hapi = require("hapi");',
      'var poop; poop = require("poop");'
    ];

    ruleTester.run(HapiCapitalizeModules.esLintRuleName, HapiCapitalizeModules, {
      valid: [],
      invalid: invalid.map(function (code) {
        return {
          code: code,
          ecmaFeatures: {modules: true},
          options: ['global-scope-only'],
          errors: [{message: 'Imported module variable name not capitalized.'}]
        };
      })
    });
    done();
  });

  it('does not report anything for non-module variables', function (done) {
    var ruleTester = new RuleTester();
    var code = [
      'var foo, bar, baz;',
      'var foo = fn()',
      'var foo = "string";',
      'var foo = this.bar()',
      'foo[bar] = 5;',
      'this.foo = null;',
      '[foo, bar] = [1, 2];',
      '[foo, bar] = require("baz");',
      'const {foo} = require("bar");'
    ];

    ruleTester.run(HapiCapitalizeModules.esLintRuleName, HapiCapitalizeModules, {
      valid: code.map(function (code) {
        return {
          code: code,
          parserOptions: {ecmaVersion: 6}
        };
      }),
      invalid: []
    });
    done();
  });
});
