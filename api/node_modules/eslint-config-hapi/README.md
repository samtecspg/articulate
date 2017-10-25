# eslint-config-hapi

[![Current Version](https://img.shields.io/npm/v/eslint-config-hapi.svg)](https://www.npmjs.org/package/eslint-config-hapi)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/eslint-config-hapi.svg?branch=master)](https://travis-ci.org/continuationlabs/eslint-config-hapi)
![Dependencies](http://img.shields.io/david/continuationlabs/eslint-config-hapi.svg)

Shareable ESLint config for the hapi ecosystem. To use in your project, add `eslint-config-hapi` and [`eslint-plugin-hapi`](https://github.com/continuationlabs/eslint-plugin-hapi) to your `package.json`, then in your ESLint configuration add:

```
{
  "extends": "eslint-config-hapi"
}
```

ESLint will automatically insert the `eslint-config-`, so technically, you can just write `"extends": "hapi"`.

**Note:** `eslint-plugin-hapi` is a plugin containing custom hapi linting rules. It is a peer dependency because of the way ESLint handles shareable configs that include plugins and custom rules (see [eslint/eslint#3458](https://github.com/eslint/eslint/issues/3458) and [eslint/eslint#2518](https://github.com/eslint/eslint/issues/2518) for more background).
