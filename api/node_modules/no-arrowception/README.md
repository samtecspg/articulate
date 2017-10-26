# no-arrowception

[![Current Version](https://img.shields.io/npm/v/no-arrowception.svg)](https://www.npmjs.org/package/no-arrowception)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/no-arrowception.svg?branch=master)](https://travis-ci.org/continuationlabs/no-arrowception)
![Dependencies](http://img.shields.io/david/continuationlabs/no-arrowception.svg)

ESLint rule preventing arrow functions that implicitly create arrow functions. This rule prevents the pattern `() => () => () => ...;`. This rule does not accept any configuration options.
