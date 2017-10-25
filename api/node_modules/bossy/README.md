# bossy

Command line options parser.

[![Build Status](https://secure.travis-ci.org/hapijs/bossy.png)](http://travis-ci.org/hapijs/bossy)

Lead Maintainer - [sericaia](https://github.com/sericaia)


## Usage

```js
var Bossy = require('bossy');

var definition = {
    h: {
        description: 'Show help',
        alias: 'help',
        type: 'boolean'
    },
    n: {
        description: 'Show your name',
        alias: 'name'
    }
};


var args = Bossy.parse(definition);

if (args instanceof Error) {
    console.error(args.message);
    return;
}

if (args.h || !args.n) {
    console.log(Bossy.usage(definition, 'hello -n <name>'));
    return;
}

console.log('Hello ' + args.n);
console.log('Hello ' + args.name);
```

## Methods

### `parse(definition, [options])`

Expects a *bossy* definition object and will return the parsed `process.argv` arguments provided.  If there is an error
then the return value will be an `instanceof Error`.

Options accepts the following keys:
* `argv` - custom argv array value.  Defaults to process.argv.

### `usage(definition, [usage], [options])`

Format a  *bossy* definition object for display in the console.  If `usage` is provided the returned value will
include the usage value formatted at the top of the message.

Options accepts the following keys:
* `colors` - Determines if colors are enabled when formatting usage.  Defaults to whatever TTY supports.


## Definition Object

The definition object should be structured with each object key representing the short form of an available command
line argument.  Each argument key supports the following properties:

* `alias`: A string or array of strings that can also be used as the argument name.  For example:
```
h: {
    alias: 'help'
}
```

* `type`: Available types are: `boolean`, `range`, `number`, `string`, and `help`.  Defaults to `string`.

    `help` is a special type that allows the switch to be executed even though
    other paramters are required. Use case is to display a help message and
    quit. This will bypass all other errors, so be sure to capture it. It
    behaves like a `boolean`.

* `multiple` : Boolean to indicate if the same argument can be provided multiple times. If true, the parsed value
will always be an array of `type`'s. Defaults to `false`.

* `description`: Description message that will be returned with usage information.

* `require`: Boolean to indicate if the argument is required.  Defaults to `false`

* `default`: A default value to assign to the argument if its not provided as an argument.

* `valid`: A value or array of values that the argument is allowed to equal.
