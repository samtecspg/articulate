# hapi-scope-start

[![Current Version](https://img.shields.io/npm/v/hapi-scope-start.svg)](https://www.npmjs.org/package/hapi-scope-start)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/hapi-scope-start.svg?branch=master)](https://travis-ci.org/continuationlabs/hapi-scope-start)
![Dependencies](http://img.shields.io/david/continuationlabs/hapi-scope-start.svg)

ESLint rule to enforce new line at the beginning of function scope

## Rule Options

### `allow-one-liners`

If the string `'allow-one-liners'` is passed as the first option to this rule,
then functions whose bodies contain zero or one statements are allowed to be
written on a single line. This defaults to `true` for arrow functions, and
`false` otherwise.

### `max-in-one-liner`

The second option to this rule dictates the maximum number of statements allowed
in the bodies of one line function. This must be used in conjunction with
`allow-one-liners`. Defaults to one.
