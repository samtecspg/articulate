# `npm install find-rc`

Find a `rc` file given a name.  Inspiration from [rc](https://github.com/dominictarr/rc).

[![Build Status](https://secure.travis-ci.org/geek/find-rc.svg)](http://travis-ci.org/geek/find-rc)

The rc file is assumed to be written in JavaScript, therefore the filename must
be `.${app}rc.js`.  If your app is named 'lab' then the rc file must be named
`.labrc.js`.

Here is the order that folders will be searched:

1. Current directory
2. Parent of current directory, until the root folder is encountered
3. $HOME/.${app}rc.js
4. $HOME/.config/.${app}rc.js


### `(appname, [startDir])`

- `appname` - name of file you are looking for.  Example: `lab`.  It will be formatted as `.{appname}rc.js`
- `startDir` - (optional) directory to start looking for the file.  Defaults to `process.cwd`

Example

```js
const FindRc = require('find-rc');

const filePath = FindRc('lab');
if (filePath) {
  // load file and parse configuration
  const rc = require(filePath);
}
```
