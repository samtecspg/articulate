# API Reference

Most interaction with **vision** is done via the [server](https://github.com/hapijs/hapi/blob/master/API.md#server)
and [reply](https://github.com/hapijs/hapi/blob/master/API.md#reply-interface) interfaces. When the
**vision** plugin is registered, the base [Hapi APIs](https://github.com/hapijs/hapi/blob/master/API.md)
are augmented as follows:

- [Server](#server)
    - [`server.views(options)`](#serverviewsoptions)
    - [`server.render(template, context, [options], [callback])`](#serverrendertemplate-context-options-callback)
- [Requests](#requests)
    - [`request.render(template, context, [options], [callback])`](#requestrendertemplate-context-options-callback)
    - [The `view` handler](#the-view-handler)
- [Reply interface](#reply-interface)
    - [`reply.view(template, [context, [options]])`](#replyviewtemplate-context-options)
- [View Manager](#view-manager)
    - [`manager.registerHelper(name, helper)`](#managerregisterhelpername-helper)
    - [`manager.render(template, context, options, callback)`](#managerrendertemplate-context-options-callback)

## [Server](https://github.com/hapijs/hapi/blob/master/API.md#server)

### `server.views(options)`

Initializes the server views manager where:
- `options` - a configuration object with the following:
    - `engines` - required object where each key is a file extension (e.g. 'html', 'hbr'), mapped
      to the npm module used for rendering the templates. Alternatively, the extension can be
      mapped to an object with the following options:
        - `module` - the npm module used for rendering the templates. The module object must
          contain the `compile()` function:
            - `compile()` - the rendering function. The required function signature depends on the
              `compileMode` settings (see below). If `compileMode` is `'sync'`, the signature is
              `compile(template, options)`, the return value is a function with signature
              `function(context, options)` (the compiled sync template), and the method is allowed to throw errors. If
              `compileMode` is `'async'`, the signature is `compile(template, options, next)`
              where `next` has the signature `function(err, compiled)`, `compiled` is a
              function with signature `function(context, options, callback)` (the compiled async template) and `callback` has the
              signature `function(err, rendered)`.
            - `prepare(config, next)` - initializes additional engine state.
              The `config` object is the engine configuration object allowing updates to be made.
              This is useful for engines like Nunjucks that rely on additional state for rendering.
              `next` has the signature `function(err)`.
            - `registerPartial(name, src)` - registers a partial for use during template rendering.
              The `name` is the partial path that templates should use to reference the partial and
              `src` is the uncompiled template string for the partial.
            - `registerHelper(name, helper)` - registers a helper for use during template rendering.
              The `name` is the name that templates should use to reference the helper and `helper`
              is the function that will be invoked when the helper is called.
        - any of the `views` options listed below (except `defaultExtension`) to override the
          defaults for a specific engine.
    - `defaultExtension` - defines the default filename extension to append to template names when
      multiple engines are configured and not explicit extension is provided for a given template.
      No default value.
    - `path` - the root file path, or array of file paths, used to resolve and load the templates identified when calling
      [`reply.view()`](https://github.com/hapijs/hapi/blob/master/API.md#replyviewtemplate-context-options).
      Defaults to current working directory.
    - `partialsPath` - the root file path, or array of file paths, where partials are located. Partials are small segments
      of template code that can be nested and reused throughout other templates. Defaults to no
      partials support (empty path).
    - `helpersPath` - the directory path, or array of directory paths, where helpers are located. Helpers are functions used
      within templates to perform transformations and other data manipulations using the template
      context or other inputs. Each '.js' file in the helpers directory is loaded and the file name
      is used as the helper name. The files must export a single method with the signature
      `function(context)` and return a string. Sub-folders are not supported and are ignored.
      Defaults to no helpers support (empty path). Note that jade does not support loading helpers
      this way.
    - `relativeTo` - a base path used as prefix for `path` and `partialsPath`. No default.
    - `layout` - if set to `true` or a layout filename, layout support is enabled. A layout is a
      single template file used as the parent template for other view templates in the same engine.
      If `true`, the layout template name must be 'layout.ext' where 'ext' is the engine's
      extension. Otherwise, the provided filename is suffixed with the engine's extension and
      loaded. Disable `layout` when using Jade as it will handle including any layout files
      independently. Defaults to `false`.
    - `layoutPath` - the root file path, or array of file paths, where layout templates are located (using the `relativeTo`
      prefix if present). Defaults to `path`.
    - `layoutKeyword` - the key used by the template engine to denote where primary template
      content should go. Defaults to `'content'`.
    - `encoding` - the text encoding used by the templates when reading the files and outputting
      the result. Defaults to `'utf8'`.
    - `isCached` - if set to `false`, templates will not be cached (thus will be read from file on
      every use). Defaults to `true`.
    - `allowAbsolutePaths` - if set to `true`, allows absolute template paths passed to
      [`reply.view()`](https://github.com/hapijs/hapi/blob/master/API.md#replyviewtemplate-context-options).
      Defaults to `false`.
    - `allowInsecureAccess` - if set to `true`, allows template paths passed to
      [`reply.view()`](https://github.com/hapijs/hapi/blob/master/API.md#replyviewtemplate-context-options)
      to contain '../'. Defaults to `false`.
    - `compileOptions` - options object passed to the engine's compile function. Defaults to empty
      options `{}`.
    - `runtimeOptions` - options object passed to the returned function from the compile operation.
      Defaults to empty options `{}`.
    - `contentType` - the content type of the engine results. Defaults to `'text/html'`.
    - `compileMode` - specify whether the engine `compile()` method is `'sync'` or `'async'`.
      Defaults to `'sync'`.
    - `context` - a global context used with all templates. The global context option can be either
      an object or a function that takes the [`request`](https://github.com/hapijs/hapi/blob/master/API.md#request-properties)
      as its only argument and returns a context object. The
      [`request`](https://github.com/hapijs/hapi/blob/master/API.md#request-properties) object is only provided when using
      the [view handler](#the-view-handler) or [`reply.view()`](#replyviewtemplate-context-options). When using
      [`server.render()`](#serverrendertemplate-context-options-callback) or
      [`request.render()`](#requestrendertemplate-context-options-callback), the
      [`request`](https://github.com/hapijs/hapi/blob/master/API.md#request-properties) argument will be `null`. When rendering
      views, the global context will be merged with any context object specified on the handler or using
      [`reply.view()`](#replyviewtemplate-context-options). When multiple context objects are used, values from the global
      context always have lowest precedence.

When [`server.views()`](https://github.com/hapijs/hapi/blob/master/API.md#serverviewsoptions) is called within a
plugin, the views manager is only available to [plugins](https://github.com/hapijs/hapi/blob/master/API.md#plugins)
methods.

`server.views()` returns a [view manager](#view-manager) that can be used to programmatically manipulate the engine configuration.

### `server.render(template, context, [options], [callback])`

Utilizes the server views manager to render a template where:
- `template` - the template filename and path, relative to the views manager templates path (`path`
  or `relativeTo`).
- `context` - optional object used by the template to render context-specific result. Defaults to
  no context (`{}`).
- `options` - optional object used to override the views manager configuration.
- `callback` - the callback function with signature `function (err, rendered, config)` where:
    - `err` - the rendering error if any.
    - `rendered` - the result view string.
    - `config` - the configuration used to render the template.

If no `callback` is provided, a `Promise` object is returned. The returned promise is resolved with only the
rendered content an not the configuration object.

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 80 });

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/templates'
    });

    const context = {
        title: 'Views Example',
        message: 'Hello, World'
    };

    server.render('hello', context, (err, rendered, config) => {

        console.log(rendered);
    });
});
```

## [Requests](https://github.com/hapijs/hapi/blob/master/API.md#requests)

### `request.render(template, context, [options], [callback])`

`request.render()` works the same way as [`server.render()`](#serverrendertemplate-context-options-callback)
but is for use inside of request handlers. [`server.render()`](#serverrendertemplate-context-options-callback)
does not work inside request handlers when called via `request.server.render()` if the view manager was created
by a plugin. This is because the `request.server` object does not have access to the plugin realm where the
view manager was configured. `request.render()` gets its realm from the route that the request was bound to.

Note that this will not work in `onRequest` extensions added by the plugin because the route isn't yet set at
this point in the request lifecycle and the `request.render()` method will produce the same limited results
[`server.render()`](#serverrendertemplate-context-options-callback) can.

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 80 });

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/templates'
    });

    server.route({
        method: 'GET',
        path: '/view',
        handler: function (request, reply) {

            request.render('test', { message: 'hello' }, (err, rendered, config) => {

                return reply(rendered);
            });
        }
    });
});
```

### The `view` handler

The `view` handler can be used with routes registered in the same realm as the view manager. The
handler takes an `options` parameter that can be either a string or an object. When the `options`
parameter is a string, it should be the filename and path of the template relative to the templates
path configured via the views manager. When the `options` parameter is an object, it may have the
following keys:

- `template` - the template filename and path, relative to the templates path configured via the
  server views manager.
- `context` - optional object used by the template to render context-specific result. Defaults to
  no context `{}`.
- `options` - optional object used to override the server's views manager configuration for this
  response. Cannot override `isCached`, `partialsPath`, or `helpersPath` which are only loaded at
  initialization.

The rendering `context` contains the `params`, `payload`, `query`, and `pre` values from the
[request](https://github.com/hapijs/hapi/blob/master/API.md#request-properties) by default (these
can be overriden by values explicitly set via the `options`).

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 80 });

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/templates'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            view: {
                template: 'hello',
                context: {
                    title: 'Views Example',
                    message: 'Hello, World'
                }
            }
        }
    });
});
```

## [Reply Interface](https://github.com/hapijs/hapi/blob/master/API.md#reply-interface)

### `reply.view(template, [context, [options]])`

Concludes the handler activity by returning control over to the router with a templatized view
response where:

- `template` - the template filename and path, relative to the templates path configured via the
  server views manager.
- `context` - optional object used by the template to render context-specific result. Defaults to
  no context `{}`.
- `options` - optional object used to override the server's views manager configuration for this
  response. Cannot override `isCached`, `partialsPath`, or `helpersPath` which are only loaded at
  initialization.

Returns a [response object](https://github.com/hapijs/hapi/blob/master/API.md#response-object).
The generated response will have the `variety` property set to `view`.

The [response flow control rules](https://github.com/hapijs/hapi/blob/master/API.md#flow-control) apply.

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 80 });

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/templates'
    });

    const handler = function (request, reply) {

        const context = {
            title: 'Views Example',
            message: 'Hello, World'
        };

        return reply.view('hello', context);
    };

    server.route({ method: 'GET', path: '/', handler: handler });
});
```

**templates/hello.html**

```html
<!DOCTYPE html>
<html>
    <head>
        <title>{{title}}</title>
    </head>
    <body>
        <div>
            <h1>{{message}}</h1>
        </div>
    </body>
</html>
```

## View Manager

## `manager.registerHelper(name, helper)`

Registers a helper, on all configured engines that have a `registerHelper()` method, for use during template rendering. Engines without a `registerHelper()` method will be skipped. The `name` is the name that templates should use to reference the helper and `helper` is the function that will be invoked when the helper is called.

## `manager.render(template, context, options, [callback])`

Renders a template. This is typically not needed and it is usually more convenient to use [`server.render()`](#serverrendertemplate-context-options-callback).
