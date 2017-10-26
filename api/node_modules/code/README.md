# code

> BDD assertion library.

[![Current Version](https://img.shields.io/npm/v/code.svg)](https://www.npmjs.org/package/code)
[![Build Status](https://secure.travis-ci.org/hapijs/code.svg)](http://travis-ci.org/hapijs/code)

Lead Maintainer - [Colin Ihrig](https://github.com/cjihrig)

## Example

```js
const Code = require('code');
const expect = Code.expect;

expect(true).to.be.a.boolean().and.to.not.equal(false);
expect('this string').to.only.include(['this', 'string']);
```

## Acknowledgments

**code** was created as a direct rewrite of the powerful [**chai**](http://chaijs.com) assertions
library. This virtual fork was created for a few reasons. First, **chai** mixed usage of methods and
properties creates a problematic environment in which it is too easy to forget a method `()` and result
in an assertion that is never executed (and therefor passes incorrectly). This observation was noted by
the [**must**](https://github.com/moll/js-must) author.

The second reason is that similar to [**lab**](https://github.com/hapijs/lab), our test runner, we wanted
an assertion library that is small, simple, and intuitive - without plugins, extensions, or the overhead
of having to support testing in the browser. **code** provides much of the same functionality in about
300 lines of code that are trivial to read in a few minutes.

And last, we wanted to experiment with some new features that allow deeper integration between the test
runner and assertions library. The first of which are two methods exported (and used by **lab**) for getting
the total assertions count (which is a measure of the tests comprehensiveness), and by verifying that every
assertion created (e.g. every `expect()` call) is also executed. This will alert when a statement like
`expect(5).to.be.a.string` is not allowed to remain unnoticed (and fail to throw due to the missing `()`).

Like **lab**, the goal is to keep this module small and simple. If you need extensibility or other
functionality, we recommend looking at the many other excellent assertions libraries available.

## API
See the [API Reference](API.md).
