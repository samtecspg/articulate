#vision

Templates rendering plugin support for hapi.js.

[![Build Status](https://secure.travis-ci.org/hapijs/vision.png)](http://travis-ci.org/hapijs/vision)

Lead Maintainer - [Jeffrey Jagoda](https://github.com/jagoda)

**vision** decorates the [server](https://github.com/hapijs/hapi/blob/master/API.md#server),
[request](https://github.com/hapijs/hapi/blob/master/API.md#request-object), and
[reply](https://github.com/hapijs/hapi/blob/master/API.md#reply-interface) interfaces with additional
methods for managing view engines that can be used to render templated responses. **vision** also
provides a built-in [handler](https://github.com/hapijs/hapi/blob/master/API.md#serverhandlername-method)
implementation for creating templated responses.

**You will need to install `vision` using something like `npm install --save vision` before you can register it.**

```js
const server = new Hapi.Server();
server.connection({ port: 8080 });

server.register(require('vision'), (err) => {

    if (err) {
        console.log("Failed to load vision.");
    }
});
```
**NOTE:** Vision is included with and loaded by default in Hapi < 9.0.

- [Examples](#examples)
    - [EJS](#ejs)
    - [Handlebars](#handlebars)
    - [Jade](#jade)
    - [Mustache](#mustache)
    - [Nunjucks](#nunjucks)

See [API.md](./API.md) for detailed usage information.

## Examples

**vision** is compatible with most major templating engines out of the box. Engines that don't follow
the normal API pattern can still be used by mapping their API to the **vision** API. Working code for
the following examples can be found in the [examples directory](./examples).

### EJS

```js
const server = new Hapi.Server();
server.connection({ port: 8000 });

const rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/ejs/index.js | Hapi ' + request.server.version,
        message: 'Index - Hello World!'
    });
};

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { ejs: require('ejs') },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });
});
```

### Handlebars

```js
const server = new Hapi.Server();
server.connection({ port: 8000 });

const handler = function (request, reply) {

    reply.view('basic/index', {
        title: 'examples/views/handlebars/basic.js | Hapi ' + request.server.version,
        message: 'Hello World!'
    });
};

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/templates'
    });

    server.route({ method: 'GET', path: '/', handler: handler });
});
```

### Jade

```js
const server = new Hapi.Server();
server.connection({ port: 8000 });

const rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/jade/index.js | Hapi ' + request.server.version,
        message: 'Index - Hello World!'
    });
};

const aboutHandler = function (request, reply) {

    reply.view('about', {
        title: 'examples/views/jade/index.js | Hapi ' + request.server.version,
        message: 'About - Hello World!'
    });
};

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { jade: require('jade') },
        path: __dirname + '/templates',
        compileOptions: {
            pretty: true
        }
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });
    server.route({ method: 'GET', path: '/about', handler: aboutHandler });
});
```

### Mustache

```js
const server = new Hapi.Server();
server.connection({ port: 8000 });

const rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/mustache/index.js | Hapi ' + request.server.version,
        message: 'Index - Hello World!'
    });
};

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: {
            html: {
                compile: function (template) {

                    Mustache.parse(template);

                    return function (context) {

                        return Mustache.render(template, context);
                    };
                }
            }
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });
});
```

### Nunjucks

```js
const server = new Hapi.Server();
server.connection({ port: 8000 });

const rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/nunjucks/index.js | Hapi ' + request.server.version,
        message: 'Index - Hello World!'
    });
};

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: {
            html: {
                compile: function (src, options) {

                    var template = Nunjucks.compile(src, options.environment);

                    return function (context) {

                        return template.render(context);
                    };
                },

                prepare: function (options, next) {

                    options.compileOptions.environment = Nunjucks.configure(options.path, { watch : false });
                    return next();
                }
            }
        },
        path: Path.join(__dirname, 'templates')
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });
});
```
