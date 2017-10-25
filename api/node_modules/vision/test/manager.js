'use strict';
// Load modules

const Fs = require('fs');
const Code = require('code');
const Handlebars = require('handlebars');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Pug = require('pug');
const Lab = require('lab');
const Vision = require('..');
const Manager = require('../lib/manager');
const Mustache = require('mustache');
const Util = require('util');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('Manager', () => {

    it('renders handlebars template', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: {
                html: {
                    module: require('handlebars'),
                    path: __dirname + '/templates/valid'
                }
            }
        });

        server.route({ method: 'GET', path: '/handlebars', handler: { view: { template: 'test.html', context: { message: 'Hello World!' } } } });

        server.inject('/handlebars', (res) => {

            expect(res.result).to.exist();
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('shallow copies global context', (done) => {

        const options = {
            engines: {
                html: {
                    module: require('handlebars'),
                    path: __dirname + '/templates/valid'
                }
            },
            context: {
                a: 1
            }
        };

        const manager = new Manager(options);

        expect(manager._context).to.equal(options.context);
        done();
    });

    it('sets content type', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: {
                html: {
                    module: require('handlebars'),
                    path: __dirname + '/templates/valid',
                    contentType: 'something/else'
                }
            }
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'test', context: { message: 'Hello World!' } } } });
        server.inject('/', (res) => {

            expect(res.headers['content-type']).to.equal('something/else');
            expect(res.result).to.exist();
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('errors on invalid template path', (done) => {

        const server = new Hapi.Server({ debug: false });
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            path: __dirname + '/templates/invalid'
        });

        // Rendering errors are not available to extensions.

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'test', context: { message: 'Hello, World!' } } } });
        server.inject('/', (res) => {

            expect(res.statusCode).to.equal(500);
            done();
        });
    });

    it('returns a compiled Handlebars template reply', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            path: __dirname + '/templates/valid'
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'test', context: { message: 'Hello, World!' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.result).to.have.string('Hello, World!');
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('errors absolute path given and allowAbsolutePath is false (by default)', (done) => {

        const server = new Hapi.Server({ debug: false });
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            path: __dirname + '/templates/valid'
        });

        // Compilation errors sould be available for extensions.

        let error = null;
        server.ext('onPostHandler', (request, reply) => {

            const response = request.response;
            if (response.isBoom) {
                error = response;
            }

            reply.continue();
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: __dirname + '/templates/valid/test', context: { message: 'Hello, World!' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.statusCode).to.equal(500);
            expect(error).to.be.an.instanceof(Error);
            done();
        });
    });

    it('errors if path given includes ../ and allowInsecureAccess is false (by default)', (done) => {

        const server = new Hapi.Server({ debug: false });
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            path: __dirname + '/templates/valid'
        });

        // Compilation errors sould be available for extensions.

        let error = null;
        server.ext('onPostHandler', (request, reply) => {

            const response = request.response;
            if (response.isBoom) {
                error = response;
            }

            reply.continue();
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: '../test', context: { message: 'Hello, World!' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.statusCode).to.equal(500);
            expect(error).to.be.an.instanceof(Error);
            done();
        });
    });

    it('allows if path given includes ../ and allowInsecureAccess is true', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            allowInsecureAccess: true,
            path: __dirname + '/templates/valid/helpers'
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: '../test', context: { message: 'Hello, World!' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.result).to.have.string('Hello, World!');
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('errors if template does not exist()', (done) => {

        const server = new Hapi.Server({ debug: false });
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            path: __dirname + '/templates/valid'
        });

        // Compilation errors sould be available for extensions.

        let error = null;
        server.ext('onPostHandler', (request, reply) => {

            const response = request.response;
            if (response.isBoom) {
                error = response;
            }

            reply.continue();
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'testNope', context: { message: 'Hello, World!' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.statusCode).to.equal(500);
            expect(error).to.be.an.instanceof(Error);
            done();
        });
    });

    it('errors if engine.compile throws', (done) => {

        const server = new Hapi.Server({ debug: false });
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            path: __dirname + '/templates/valid'
        });

        // Compilation errors sould be available for extensions.

        let error = null;
        server.ext('onPostHandler', (request, reply) => {

            const response = request.response;
            if (response.isBoom) {
                error = response;
            }

            reply.continue();
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'badmustache', context: { message: 'Hello, World!' }, options: { path: __dirname + '/templates/valid/invalid' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.statusCode).to.equal(500);
            expect(error).to.be.an.instanceof(Error);
            done();
        });
    });

    it('should not fail if rendered template returns undefined', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: {
                html: {
                    module: {
                        compile: function (template, compileOptions) {

                            return function (context, renderOptions) {

                                return undefined;
                            };
                        }
                    },
                    path: __dirname + '/templates/valid'
                }
            }
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'test.html' } } });

        server.inject('/', (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('allows the context to be modified by extensions', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates/valid'
        });

        server.ext('onPreResponse', (request, reply) => {

            const response = request.response;
            response.source.context.message = 'goodbye';

            reply.continue();
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'test.html', context: { message: 'hello' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.result).not.to.contain('hello');
            expect(res.result).to.contain('goodbye');
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    describe('with engine initialization', () => {

        it('modifies the engine options', (done) => {

            let compileOptions;
            let runtimeOptions;

            const manager = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compile: function (string, options1) {

                            compileOptions = options1;

                            return function (context, options2) {

                                runtimeOptions = options2;
                                return string;
                            };
                        },

                        prepare: function (options, next) {

                            options.compileOptions = { stage: 'compile' };
                            options.runtimeOptions = { stage: 'render' };
                            return next();
                        }
                    }
                }
            });

            manager.render('valid/test', null, null, (err, rendered) => {

                expect(err).to.not.exist();
                expect(compileOptions).to.include({ stage: 'compile' });
                expect(runtimeOptions).to.include({ stage: 'render' });
                done();
            });
        });

        it('errors if initialization fails', (done) => {

            const manager = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compile: function (string, options1) {

                            return function (context, options2) {

                                return string;
                            };
                        },

                        prepare: function (options, next) {

                            return next(new Error('Initialization failed'));
                        }
                    }
                }
            });

            manager.render('valid/test', null, null, (err, rendered) => {

                expect(err).to.be.an.instanceOf(Error);
                expect(err.message).to.equal('Initialization failed');
                expect(rendered).to.not.exist();
                done();
            });
        });

        it('errors if initialization throws', (done) => {

            const manager = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compile: function (string, options1) {

                            return function (context, options2) {

                                return string;
                            };
                        },

                        prepare: function (options, next) {

                            throw new Error('Initialization error');
                        }
                    }
                }
            });

            manager.render('valid/test', null, null, (err, rendered) => {

                expect(err).to.be.an.instanceOf(Error);
                expect(err.message).to.equal('Initialization error');
                expect(rendered).to.not.exist();
                done();
            });
        });

        it('only initializes once before rendering', (done) => {

            let initialized = 0;

            const manager = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compile: function (string, options1) {

                            return function (context, options2) {

                                return string;
                            };
                        },

                        prepare: function (options, next) {

                            ++initialized;
                            return next();
                        }
                    }
                }
            });

            expect(initialized).to.equal(0);
            manager.render('valid/test', null, null, (err, rendered1) => {

                expect(err).to.not.exist();
                expect(rendered1).to.exist();
                expect(initialized).to.equal(1);
                manager.render('valid/test', null, null, (err, rendered2) => {

                    expect(err).to.not.exist();
                    expect(rendered2).to.exist();
                    expect(initialized).to.equal(1);
                    done();
                });
            });
        });

        it('initializes multiple engines independently', (done) => {

            let htmlOptions;
            let jadeOptions;

            const manager = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compile: function (string, options1) {

                            htmlOptions = options1;
                            return function (context, options2) {

                                return string;
                            };
                        },

                        prepare: function (options, next) {

                            options.compileOptions = { engine: 'handlebars' };
                            return next();
                        }
                    },

                    pug: {
                        compile: function (string, options1) {

                            jadeOptions = options1;
                            return function (context, options2) {

                                return string;
                            };
                        },

                        prepare: function (options, next) {

                            options.compileOptions = { engine: 'pug' };
                            return next();
                        }
                    }
                }
            });

            manager.render('valid/test.html', null, null, (err, rendered1) => {

                expect(err).to.not.exist();
                expect(rendered1).to.exist();
                expect(htmlOptions).to.include({ engine: 'handlebars' });
                expect(jadeOptions).to.not.exist();

                manager.render('valid/test.pug', null, null, (err, rendered2) => {

                    expect(err).to.not.exist();
                    expect(rendered2).to.exist();
                    expect(jadeOptions).to.include({ engine: 'pug' });
                    done();
                });
            });
        });
    });

    it('should not error on layoutKeyword conflict', (done) => {

        const server = new Hapi.Server({ debug: false });
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { 'html': require('handlebars') },
            path: __dirname + '/templates/valid'
        });

        // Rendering errors are not available to extensions.

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'test', context: { message: 'Hello, World!', content: 'fail' } } } });

        server.inject('/', (res) => {

            expect(res.result).to.exist();
            expect(res.statusCode).to.equal(200);
            expect(res.payload).to.contain('Hello, World!');
            done();
        });
    });

    describe('with layout', (done) => {

        it('returns response', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates',
                layout: true
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                expect(res.result.replace(/\r/g, '')).to.equal('<!DOCTYPE html>\n<html>\n    <head>\n        <title>test</title>\n    </head>\n    <body>\n        <div>\n    <h1>Hapi</h1>\n</div>\n\n    </body>\n</html>\n');
                done();
            });
        });

        it('returns response with relativeTo and absolute path', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                relativeTo: '/none/shall/pass',
                path: __dirname + '/templates',
                layout: true
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                expect(res.result.replace(/\r/g, '')).to.equal('<!DOCTYPE html>\n<html>\n    <head>\n        <title>test</title>\n    </head>\n    <body>\n        <div>\n    <h1>Hapi</h1>\n</div>\n\n    </body>\n</html>\n');
                done();
            });
        });

        it('returns response with layout override', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates',
                layout: true
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' }, options: { layout: 'otherLayout' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                expect(res.result.replace(/\r/g, '')).to.equal('test:<div>\n    <h1>Hapi</h1>\n</div>\n');
                done();
            });
        });

        it('returns response with custom server layout', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates',
                layout: 'otherLayout'
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                expect(res.result.replace(/\r/g, '')).to.equal('test:<div>\n    <h1>Hapi</h1>\n</div>\n');
                done();
            });
        });

        it('returns response with custom server layout and path', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                relativeTo: __dirname,
                path: 'templates',
                layoutPath: 'templates/layout',
                layout: 'elsewhere'
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                expect(res.result.replace(/\r/g, '')).to.equal('test+<div>\n    <h1>Hapi</h1>\n</div>\n');
                done();
            });
        });

        it('errors on missing layout', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates',
                layout: 'missingLayout'
            });

            // Compilation errors sould be available for extensions.

            let error = null;
            server.ext('onPostHandler', (request, reply) => {

                const response = request.response;
                if (response.isBoom) {
                    error = response;
                }

                reply.continue();
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' } } } });

            server.inject('/', (res) => {

                expect(res.statusCode).to.equal(500);
                expect(error).to.be.an.instanceof(Error);
                done();
            });
        });

        it('errors on invalid layout', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates',
                layout: 'invalidLayout'
            });

            // Compilation errors sould be available for extensions.

            let error = null;
            server.ext('onPostHandler', (request, reply) => {

                const response = request.response;
                if (response.isBoom) {
                    error = response;
                }

                reply.continue();
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' } } } });

            server.inject('/', (res) => {

                expect(res.statusCode).to.equal(500);
                expect(error).to.be.an.instanceof(Error);
                done();
            });
        });

        it('returns response without layout', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates',
                layout: true
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/test', context: { title: 'test', message: 'Hapi' }, options: { layout: false } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                expect(res.result.replace(/\r/g, '')).to.equal('<div>\n    <h1>Hapi</h1>\n</div>\n');
                done();
            });
        });

        it('errors on layoutKeyword conflict', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates/valid',
                layout: true
            });

            // Rendering errors are not available to extensions.

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'test', context: { message: 'Hello, World!', content: 'fail' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(500);
                done();
            });
        });

        it('errors absolute path given and allowAbsolutePath is false (by default)', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                engines: { 'html': require('handlebars') },
                path: __dirname + '/templates/valid',
                layout: true
            });

            // Compilation errors sould be available for extensions.

            let error = null;
            server.ext('onPostHandler', (request, reply) => {

                const response = request.response;
                if (response.isBoom) {
                    error = response;
                }

                reply.continue();
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'test', context: { title: 'test', message: 'Hapi' }, options: { path: __dirname + '/templates/valid/invalid' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(500);
                expect(error).to.be.an.instanceof(Error);
                done();
            });
        });
    });

    describe('with multiple engines', () => {

        it('renders handlebars template', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                path: __dirname + '/templates/valid',
                engines: {
                    'html': require('handlebars'),
                    'pug': require('pug'),
                    'hbar': {
                        module: {
                            compile: function (engine) {

                                return engine.compile;
                            }
                        }
                    }
                }
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'test.html', context: { message: 'Hello World!' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('renders pug template', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                path: __dirname + '/templates/valid',
                engines: {
                    'html': require('handlebars'),
                    'pug': require('pug'),
                    'hbar': {
                        module: {
                            compile: function (engine) {

                                return engine.compile;
                            }
                        }
                    }
                }
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'testMulti.pug', context: { message: 'Hello World!' } } } });

            server.inject('/', (res) => {

                expect(res.result).to.exist();
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('returns 500 on unknown extension', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                path: __dirname + '/templates/valid',
                engines: {
                    'html': require('handlebars'),
                    'pug': require('pug'),
                    'hbar': {
                        module: {
                            compile: function (engine) {

                                return engine.compile;
                            }
                        }
                    }
                }
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'test', context: { message: 'Hello World!' } } } });

            server.inject('/', (res) => {

                expect(res.statusCode).to.equal(500);
                done();
            });
        });

        it('returns 500 on missing extension engine', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Vision, Hoek.ignore);
            server.views({
                path: __dirname + '/templates/valid',
                engines: {
                    'html': require('handlebars'),
                    'pug': require('pug'),
                    'hbar': {
                        module: {
                            compile: function (engine) {

                                return engine.compile;
                            }
                        }
                    }
                }
            });

            server.route({ method: 'GET', path: '/', handler: { view: { template: 'test.xyz', context: { message: 'Hello World!' } } } });

            server.inject('/', (res) => {

                expect(res.statusCode).to.equal(500);
                done();
            });
        });
    });

    describe('render()', () => {

        it('renders with async compile', (done) => {

            const views = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compileMode: 'async',
                        module: {
                            compile: function (string, options, callback) {

                                const compiled = Handlebars.compile(string, options);
                                const renderer = function (context, opt, next) {

                                    return next(null, compiled(context, opt));
                                };

                                return callback(null, renderer);
                            }
                        }
                    }
                }
            });

            views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('errors on sync compile that throws', (done) => {

            const views = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compileMode: 'sync',
                        module: {
                            compile: function (string, options) {

                                throw (new Error('Bad bad view'));
                            }
                        }
                    }
                }
            });

            views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).to.exist();
                expect(err.message).to.equal('Bad bad view');
                done();
            });
        });

        it('allows valid (no layouts)', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: false
            });

            testView.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('renders without context', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates'
            });

            testView.render('valid/test', null, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered.replace(/\r/g, '')).to.equal('<div>\n    <h1></h1>\n</div>\n');
                done();
            });
        });

        it('renders without handler/global-context (with layout)', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: true
            });

            testView.render('valid/test', null, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered.replace(/\r/g, '')).to.contain('<div>\n    <h1></h1>\n</div>\n');
                done();
            });
        });

        it('renders with a global context object', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',

                context: {
                    message: 'default message',

                    query: {
                        test: 'global'
                    }
                }
            });

            testView.render('valid/testContext', null, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('<h1>global</h1>');
                expect(rendered.replace(/\r/g, '')).to.contain('<h1>default message</h1>');
                done();
            });
        });

        it('overrides the global context object with local values', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',

                context: {
                    message: 'default message',

                    query: {
                        test: 'global'
                    }
                }
            });

            testView.render('valid/testContext', { message: 'override' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('<h1>global</h1>');
                expect(rendered).to.contain('<h1>override</h1>');
                done();
            });
        });

        it('renders with a global context function (no request)', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',

                context: function (request) {

                    return {
                        message: request ? request.route.path : 'default message',

                        query: {
                            test: 'global'
                        }
                    };
                }
            });

            testView.render('valid/testContext', null, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('<h1>global</h1>');
                expect(rendered).to.contain('<h1>default message</h1>');
                done();
            });
        });

        it('overrides the global context function values with local values', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',

                context: function () {

                    return {
                        message: 'default message',

                        query: {
                            test: 'global'
                        }
                    };
                }
            });

            testView.render('valid/testContext', { message: 'override' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('<h1>global</h1>');
                expect(rendered).to.contain('<h1>override</h1>');
                done();
            });
        });

        it('uses specified default ext', (done) => {

            const testView = new Manager({
                defaultExtension: 'html',
                engines: { html: require('handlebars'), pug: Pug },
                path: __dirname + '/templates'
            });

            testView.render('valid/test', null, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered.replace(/\r/g, '')).to.equal('<div>\n    <h1></h1>\n</div>\n');
                done();
            });
        });

        it('allows relative path with no base', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: './test/templates',
                layout: false
            });

            testView.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered.replace(/\r/g, '')).to.equal('<div>\n    <h1>Hapi</h1>\n</div>\n');
                done();
            });
        });

        it('allows multiple relative paths with no base', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: ['./test/templates/layout', './test/templates/valid'],
                layout: false
            });

            testView.render('test', { message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('<h1>Hapi</h1>');
                done();
            });
        });

        it('allows multiple relative paths with a base', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                relativeTo: __dirname + '/templates',
                path: ['layout', 'valid'],
                layout: false
            });

            testView.render('test', { message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered.replace(/\r/g, '')).to.contain('<h1>Hapi</h1>');
                done();
            });
        });

        it('uses the first matching template', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                relativeTo: __dirname + '/templates',
                path: ['valid', 'invalid'],
                layout: false
            });

            testView.render('test', { message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('<h1>Hapi</h1>');
                done();
            });
        });

        it('allows multiple absolute paths', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: [__dirname + '/templates/layout', __dirname + '/templates/valid'],
                layout: false
            });

            testView.render('test', { message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('<h1>Hapi</h1>');
                done();
            });
        });

        it('allows valid (with layouts)', (done) => {

            const testViewWithLayouts = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: true
            });

            testViewWithLayouts.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('allows absolute path', (done) => {

            const testViewWithLayouts = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: __dirname + '/templates/layout',
                allowAbsolutePaths: true
            });

            testViewWithLayouts.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('errors on invalid layout', (done) => {

            const views = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: 'badlayout'
            });

            views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).to.exist();
                expect(err.message).to.equal('Parse error on line 1:\n{{}\n--^\nExpecting \'ID\', \'STRING\', \'NUMBER\', \'BOOLEAN\', \'UNDEFINED\', \'NULL\', \'DATA\', got \'INVALID\': Parse error on line 1:\n{{}\n--^\nExpecting \'ID\', \'STRING\', \'NUMBER\', \'BOOLEAN\', \'UNDEFINED\', \'NULL\', \'DATA\', got \'INVALID\'');
                done();
            });
        });

        it('errors on layout compile error', (done) => {

            const views = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: 'layout'
            });

            const layout = __dirname + '/templates/layout.html';
            const mode = Fs.statSync(layout).mode;

            Fs.chmodSync(layout, '0300');
            views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                try {
                    expect(err).to.exist();
                    expect(err.message).to.contain('Failed to read view file');
                }
                finally {
                    Fs.chmodSync(layout, mode);
                }
                done();
            });
        });

        it('errors on invalid layout path', (done) => {

            const views = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: '/badlayout'
            });

            views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).to.exist();
                expect(err.message).to.equal('Absolute paths are not allowed in views');
                done();
            });
        });

        it('allows multiple layout paths', (done) => {

            const views = new Manager({
                engines: { html: require('handlebars') },
                relativeTo: __dirname + '/templates',
                path: 'valid',
                layoutPath: ['invalid', 'layout'],
                layout: 'elsewhere'
            });

            views.render('test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('uses the first matching layout', (done) => {

            const views = new Manager({
                engines: { html: require('handlebars') },
                relativeTo: __dirname,
                path: 'templates/valid',
                layoutPath: ['templates', 'templates/invalid'],
                layout: true
            });

            views.render('test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('allows valid pug layouts', (done) => {

            const testViewWithJadeLayouts = new Manager({
                engines: { pug: Pug },
                path: __dirname + '/templates' + '/valid/',
                layout: true
            });

            testViewWithJadeLayouts.render('index', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('should work and not throw without pug layouts', (done) => {

            const testViewWithoutJadeLayouts = new Manager({
                engines: { pug: Pug },
                path: __dirname + '/templates' + '/valid/',
                layout: false
            });

            testViewWithoutJadeLayouts.render('test', { title: 'test', message: 'Hapi Message' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.contain('Hapi Message');
                done();
            });
        });

        it('allows relativeTo, template name, and no path', (done) => {

            const views = new Manager({ engines: { html: require('handlebars') } });
            views.render('test', { title: 'test', message: 'Hapi' }, { relativeTo: __dirname + '/templates/valid' }, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered).to.contain('Hapi');
                done();
            });
        });

        it('errors when referencing non existant partial (with layouts)', (done) => {

            const testViewWithLayouts = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: true
            });

            testViewWithLayouts.render('invalid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).to.exist();
                done();
            });
        });

        it('errors when referencing non existant partial (no layouts)', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: false
            });

            testView.render('invalid/test', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err).to.exist();
                done();
            });

        });

        it('errors if context uses layoutKeyword as a key', (done) => {

            const testViewWithLayouts = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: true
            });

            const opts = { title: 'test', message: 'Hapi', content: 1 };
            testViewWithLayouts.render('valid/test', opts, null, (err, rendered, config) => {

                expect(err).to.exist();
                done();
            });
        });

        it('errors on compile error (invalid template code)', (done) => {

            const testView = new Manager({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates',
                layout: false
            });

            testView.render('invalid/badmustache', { title: 'test', message: 'Hapi' }, null, (err, rendered, config) => {

                expect(err instanceof Error).to.equal(true);
                done();
            });
        });

        it('loads partials and be able to render them', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                partialsPath: __dirname + '/templates/valid/partials'
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                done();
            });
        });

        it('normalizes full partial name (windows)', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                partialsPath: __dirname + '/templates/valid/partials'
            });

            tempView.render('testPartialsName', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                done();
            });
        });

        it('loads partials from relative path without base', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                partialsPath: './test/templates/valid/partials'
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                done();
            });
        });

        it('loads partals from multiple relative paths without base', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                partialsPath: ['./test/templates/invalid', './test/templates/valid/partials']
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                done();
            });
        });

        it('loads partals from multiple relative paths with base', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                relativeTo: __dirname + '/templates',
                path: 'valid',
                partialsPath: ['invalid', 'valid/partials']
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                done();
            });
        });

        it('loads partials from multiple absolute paths', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                partialsPath: [__dirname + '/templates/invalid', __dirname + '/templates/valid/partials']
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                done();
            });
        });

        it('loads partials from relative path without base (no dot)', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                partialsPath: 'test/templates/valid/partials'
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                done();
            });
        });

        it('loads partials and render them EVEN if viewsPath has trailing slash', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                partialsPath: __dirname + '/templates/valid/partials/'
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.exist();
                expect(rendered.length).above(1);
                done();
            });
        });

        it('skips loading partials and helpers if engine does not support them', (done) => {

            const tempView = new Manager({
                path: __dirname + '/templates/valid',
                partialsPath: __dirname + '/templates/valid/partials',
                helpersPath: __dirname + '/templates/valid/helpers',
                engines: { html: Pug }
            });

            tempView.render('testPartials', {}, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('Nav:{{> nav}}|{{> nested/nav}}');
                done();
            });
        });

        it('loads helpers and render them', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                helpersPath: __dirname + '/templates/valid/helpers'
            });

            tempView.render('testHelpers', { something: 'uppercase' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
                done();
            });
        });

        it('loads helpers and render them when helpersPath ends with a slash', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: __dirname + '/templates/valid',
                helpersPath: __dirname + '/templates/valid/helpers/'
            });

            tempView.render('testHelpers', { something: 'uppercase' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
                done();
            });
        });

        it('loads helpers using relative paths', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                relativeTo: './test/templates',
                path: './valid',
                helpersPath: './valid/helpers'
            });

            tempView.render('testHelpers', { something: 'uppercase' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
                done();
            });
        });

        it('loads helpers from multiple paths without a base', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                path: './test/templates/valid',
                helpersPath: ['./test/templates/valid/helpers/tools', './test/templates/valid/helpers']
            });

            tempView.render('testHelpers', { something: 'uppercase' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
                done();
            });
        });

        it('loads helpers from multiple paths with a base', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                relativeTo: './test/templates',
                path: './valid',
                helpersPath: ['./valid/helpers/tools', './valid/helpers']
            });

            tempView.render('testHelpers', { something: 'uppercase' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
                done();
            });
        });

        it('loads helpers using relative paths (without dots)', (done) => {

            const tempView = new Manager({
                engines: { html: { module: Handlebars.create() } },    // Clear environment from other tests
                relativeTo: 'test/templates',
                path: 'valid',
                helpersPath: 'valid/helpers'
            });

            tempView.render('testHelpers', { something: 'uppercase' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
                done();
            });
        });

        it('registers helpers programmatically', (done) => {

            const tempView = new Manager({
                engines: {
                    html: { module: Handlebars.create() },
                    txt: { module: Handlebars.create() }
                },
                relativeTo: 'test/templates',
                path: 'valid'
            });

            tempView.registerHelper('long', (string) => string + string.substr(-1).repeat(2));
            tempView.registerHelper('uppercase', (string) => string.toUpperCase());

            tempView.render('testHelpers.html', { something: 'uppercase' }, null, (err, rendered1) => {

                expect(err).not.to.exist();
                expect(rendered1).to.equal('<p>This is all UPPERCASE and this is howww we like it!</p>');

                tempView.render('testHelpers.txt', { something: 'uppercase' }, null, (err, rendered2) => {

                    expect(err).not.to.exist();
                    expect(rendered2).to.equal('This is all UPPERCASE and this is howww we like it!');
                    done();
                });
            });
        });

        it('does not register helpers on engines that don\'t have helper support', (done) => {

            const tempView = new Manager({
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
                relativeTo: 'test/templates',
                path: 'valid'
            });

            tempView.registerHelper('long', (string) => string + string.substr(-1).repeat(2));
            tempView.registerHelper('uppercase', (string) => string.toUpperCase());

            tempView.render('testHelpers', { something: 'uppercase' }, null, (err, rendered, config) => {

                expect(err).not.to.exist();
                expect(rendered).to.equal('<p>This is all  and this is  we like it!</p>');
                done();
            });
        });

        it('prints a warning message when helpers fail to load', (done) => {

            const buffer = [];
            const oldWarn = console.warn;

            console.warn = function () {

                const message = Util.format.apply(Util, arguments);

                buffer.push(message);
            };

            try {
                new Manager({
                    engines: { html: { module: Handlebars.create() } },
                    relativeTo: 'test/templates',
                    path: 'valid',
                    helpersPath: 'invalid/helpers'
                });
            }
            finally {
                console.warn = oldWarn;
            }

            const output = buffer.join('\n');

            expect(output).to.match(/^WARNING:/);
            expect(output).to.contain('vision failed to load helper');
            expect(output).to.contain('invalid/helpers/bad1.module');
            expect(output).to.contain('invalid/helpers/bad2.module');
            done();
        });

        it('reuses cached compilation', (done) => {

            let gen = 0;
            const views = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compileMode: 'async',
                        module: {
                            compile: function (string, options, callback) {

                                ++gen;
                                const compiled = Handlebars.compile(string, options);
                                const renderer = function (context, opt, next) {

                                    return next(null, compiled(context, opt));
                                };

                                return callback(null, renderer);
                            }
                        }
                    }
                }
            });

            views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, original, originalConfig) => {

                expect(err).not.to.exist();
                expect(original).to.exist();
                expect(original).to.contain('Hapi');

                views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, cached, cachedConfig) => {

                    expect(err).not.to.exist();
                    expect(cached).to.exist();
                    expect(cached).to.contain('Hapi');

                    expect(gen).to.equal(1);
                    done();
                });
            });
        });

        it('disables caching', (done) => {

            let gen = 0;
            const views = new Manager({
                path: __dirname + '/templates',
                engines: {
                    html: {
                        compileMode: 'async',
                        module: {
                            compile: function (string, options, callback) {

                                ++gen;
                                const compiled = Handlebars.compile(string, options);
                                const renderer = function (context, opt, next) {

                                    return next(null, compiled(context, opt));
                                };

                                return callback(null, renderer);
                            }
                        }
                    }
                },
                isCached: false
            });

            views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, original, originalConfig) => {

                expect(err).not.to.exist();
                expect(original).to.exist();
                expect(original).to.contain('Hapi');

                views.render('valid/test', { title: 'test', message: 'Hapi' }, null, (err, cached, cachedConfig) => {

                    expect(err).not.to.exist();
                    expect(cached).to.exist();
                    expect(cached).to.contain('Hapi');

                    expect(gen).to.equal(2);
                    done();
                });
            });
        });

        it('returns a promise that is resolved with the content if no callback is provided', () => {

            const views = new Manager({
                engines: { html: { module: Handlebars } },
                path: __dirname + '/templates/valid'
            });

            return views.render('test', { message: 'Hello!' }, null)
            .then((content) => {

                expect(content).to.contain('<h1>Hello!</h1>');
            });
        });

        it('returns a promise that is rejected on error if no callback is provided', () => {

            const views = new Manager({
                engines: { html: { module: Handlebars } },
                path: __dirname + '/templates/valid'
            });

            return views.render('missing', null, null)
            .then(
                () => {

                    throw new Error('should not resolve');
                },
                (err) => {

                    expect(err).to.exist();
                    expect(err.message).to.contain('missing.html');
                }
            );
        });
    });

    describe('_response()', () => {

        it('sets Content-Type', (done) => {

            const server = new Hapi.Server();
            server.register(Vision, Hoek.ignore);
            server.connection();
            server.views({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates/valid'
            });

            const handler = function (request, reply) {

                return reply.view('test.html', { message: 'hi' });
            };

            server.route({ method: 'GET', path: '/', handler });
            server.inject('/', (res) => {

                expect(res.headers['content-type']).to.contain('text/html');
                done();
            });
        });

        it('does not override Content-Type', (done) => {

            const server = new Hapi.Server();
            server.register(Vision, Hoek.ignore);
            server.connection();

            server.views({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates/valid'
            });

            const handler = function (request, reply) {

                return reply.view('test.html', { message: 'hi' }).type('text/plain');
            };

            server.route({ method: 'GET', path: '/', handler });
            server.inject('/', (res) => {

                expect(res.headers['content-type']).to.contain('text/plain');
                done();
            });
        });

        it('errors on invalid template', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.register(Vision, Hoek.ignore);
            server.connection();
            server.views({
                engines: { html: require('handlebars') },
                path: __dirname + '/templates/invalid'
            });

            const handler = function (request, reply) {

                return reply.view('test.html', { message: 'hi' });
            };

            server.route({ method: 'GET', path: '/', handler });
            server.inject('/', (res) => {

                expect(res.statusCode).to.equal(500);
                done();
            });
        });

        it('passes the response object to the global context function', (done) => {

            const server = new Hapi.Server();
            server.register(Vision, Hoek.ignore);
            server.connection();
            server.views({
                engines: { html: Handlebars },
                path: __dirname + '/templates/valid',

                context: function (request) {

                    return {
                        message: request ? request.route.path : 'default message',

                        query: {
                            test: 'global'
                        }
                    };
                }
            });

            const handler = function (request, reply) {

                return reply.view('testContext');
            };

            server.route({ method: 'GET', path: '/', handler });
            server.inject('/', (res) => {

                expect(res.payload).to.contain('<h1>/</h1>');
                expect(res.payload).to.contain('<h1>global</h1>');
                done();
            });
        });
    });
});
