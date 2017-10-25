# hapi-capitalize-modules

[![Current Version](https://img.shields.io/npm/v/hapi-capitalize-modules.svg)](https://www.npmjs.org/package/hapi-capitalize-modules)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/hapi-capitalize-modules.svg?branch=master)](https://travis-ci.org/continuationlabs/hapi-capitalize-modules)
![Dependencies](http://img.shields.io/david/continuationlabs/hapi-capitalize-modules.svg)

ESLint rule to enforce the capitalization of imported module variables.

## Rule options

### `global-scope-only`

If the string `'global-scope-only'` is passed as the first option to this rule,
then it will only be enforced on assignments in the module's top level scope.
