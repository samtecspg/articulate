'use strict';

var Code = require('code');
var ESLint = require('eslint');
var Lab = require('lab');
var NoArrowception = require('../lib');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var RuleTester = ESLint.RuleTester;

Code.settings.truncateMessages = false;

describe('ESLint Rule', function () {
  it('reports error when an arrow function implicitly creates another arrow function', function (done) {
    var ruleTester = new RuleTester();
    var valids = [
      'var foo = () => 85;',
      'var foo = () => { return 42; }',
      'var foo = () => ({});',
      'var foo = () => ({\nbar: 1});',
      'var foo = () => [];',
      'var foo = () => [\n1,\n2];',
      'var foo = () => { return () => 85; };'
    ].map(function (fn) {
      return {
        code: fn,
        ecmaFeatures: {arrowFunctions: true}
      };
    });
    var invalids = [
      'var foo = () => () => 85;'
    ].map(function (fn) {
      return {
        code: fn,
        ecmaFeatures: {arrowFunctions: true},
        errors: [{message: 'Arrow function implicitly creates arrow function.'}]
      };
    });

    ruleTester.run(NoArrowception.esLintRuleName, NoArrowception, {
      valid: valids,
      invalid: invalids
    });
    done();
  });
});
