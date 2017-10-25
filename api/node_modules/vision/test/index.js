'use strict';
// Load modules

const Path = require('path');
const Code = require('code');
const Handlebars = require('handlebars');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Pug = require('pug');
const Lab = require('lab');
const Vision = require('..');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('handler()', () => {

    it('handles routes to views', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates'
        });

        server.route({ method: 'GET', path: '/{param}', handler: { view: 'valid/handler' } });
        server.inject({
            method: 'GET',
            url: '/hello'
        }, (res) => {

            expect(res.result).to.contain('hello');
            done();
        });
    });

    it('handles custom context', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { pug: Pug },
            path: __dirname + '/templates'
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/index', context: { message: 'heyloo' } } } });
        server.inject('/', (res) => {

            expect(res.result).to.contain('heyloo');
            done();
        });
    });

    it('handles custom options', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates',
            layoutPath: __dirname + '/templates/layout'
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/options', options: { layout: 'elsewhere' } } } });
        server.inject('/', (res) => {

            expect(res.result).to.contain('+hello');
            done();
        });
    });

    it('includes prerequisites in the default view context', (done) => {

        const pre = function (request, reply) {

            reply('PreHello');
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates'
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                pre: [
                    { method: pre, assign: 'p' }
                ],
                handler: {
                    view: 'valid/handler'
                }
            }
        });

        server.inject('/', (res) => {

            expect(res.result).to.contain('PreHello');
            done();
        });
    });

    it('handles both custom and default contexts', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates'
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/testContext', context: { message: 'heyloo' } } } });
        server.inject('/?test=yes', (res) => {

            expect(res.result).to.contain('heyloo');
            expect(res.result).to.contain('yes');
            done();
        });
    });

    it('overrides default contexts when provided with context of same name', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates'
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/testContext', context: { message: 'heyloo', query: { test: 'no' } } } } });
        server.inject('/?test=yes', (res) => {

            expect(res.result).to.contain('heyloo');
            expect(res.result).to.contain('no');
            done();
        });
    });

    it('handles a global context object', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates',
            context: {
                message: 'default message'
            }
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/testContext' } } });
        server.inject('/', (res) => {

            expect(res.result).to.contain('<h1></h1>');
            expect(res.result).to.contain('<h1>default message</h1>');
            done();
        });
    });

    it('passes the request to a global context function', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates',

            context: (request) => {

                return {
                    message: request ? request.route.path : 'default'
                };
            }
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/testContext' } } });
        server.inject('/', (res) => {

            expect(res.result).to.contain('<h1></h1>');
            expect(res.result).to.contain('<h1>/</h1>');
            done();
        });
    });

    it('overrides the global context with the default handler context', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates',

            context: {
                message: 'default message',
                query: {
                    test: 'global'
                }
            }
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/testContext' } } });
        server.inject('/?test=yes', (res) => {

            expect(res.result).to.contain('<h1>yes</h1>');
            expect(res.result).to.contain('<h1>default message</h1>');
            done();
        });
    });

    it('overrides the global and default contexts with a custom handler context', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates',

            context: {
                message: 'default message',

                query: {
                    test: 'global'
                }
            }
        });

        server.route({ method: 'GET', path: '/', handler: { view: { template: 'valid/testContext', context: { message: 'override', query: { test: 'no' } } } } });
        server.inject('/?test=yes', (res) => {

            expect(res.result).to.contain('<h1>no</h1>');
            expect(res.result).to.contain('<h1>override</h1>');
            done();
        });
    });

    it('throws on missing views', (done) => {

        const server = new Hapi.Server({ debug: false });
        server.register(Vision, Hoek.ignore);
        server.connection();
        server.route({
            path: '/',
            method: 'GET',
            handler: function (request, reply) {

                return reply.view('test', { message: 'steve' });
            }
        });

        server.inject('/', (res) => {

            expect(res.statusCode).to.equal(500);
            done();
        });
    });
});

describe('render()', () => {

    it('renders view (root)', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { html: Handlebars },
            path: __dirname + '/templates/valid'
        });

        server.render('test', { title: 'test', message: 'Hapi' }, (err, rendered, config) => {

            expect(err).not.to.exist();
            expect(rendered).to.exist();
            expect(rendered).to.contain('Hapi');
            done();
        });
    });

    it('renders view (root with options)', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { html: Handlebars }
        });

        server.render('test', { title: 'test', message: 'Hapi' }, { path: Path.join(__dirname, '/templates/valid') }, (err, rendered, config) => {

            expect(err).not.to.exist();
            expect(rendered).to.exist();
            expect(rendered).to.contain('Hapi');
            done();
        });
    });

    it('renders view (plugin)', (done) => {

        const test = function (server, options, next) {

            server.views({
                engines: { 'html': Handlebars },
                relativeTo: Path.join(__dirname, '/templates/plugin')
            });

            server.render('test', { message: 'steve' }, (err, rendered, config) => {

                expect(err).not.to.exist();

                server.route([
                    {
                        path: '/view', method: 'GET', handler: function (request, reply) {

                            return reply(rendered);
                        }
                    }
                ]);

                return next();
            });
        };

        test.attributes = {
            name: 'test'
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.register(test, (err) => {

            expect(err).to.not.exist();
            server.inject('/view', (res) => {

                expect(res.result).to.equal('<h1>steve</h1>');
                done();
            });
        });
    });

    it('renders view (plugin without views)', (done) => {

        const test = function (server, options, next) {

            server.render('test', { message: 'steve' }, (err, rendered, config) => {

                expect(err).not.to.exist();

                server.route([
                    {
                        path: '/view', method: 'GET', handler: function (request, reply) {

                            return reply(rendered);
                        }
                    }
                ]);

                return next();
            });
        };

        test.attributes = {
            name: 'test'
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { 'html': Handlebars },
            relativeTo: Path.join(__dirname, '/templates/plugin')
        });

        server.register(test, (err) => {

            expect(err).to.not.exist();
            server.inject('/view', (res) => {

                expect(res.result).to.equal('<h1>steve</h1>');
                done();
            });
        });
    });

    it('renders view (plugin with options)', (done) => {

        const test = function (server, options, next) {

            server.views({
                engines: { 'html': Handlebars }
            });

            server.render('test', { message: 'steve' }, { relativeTo: Path.join(__dirname, '/templates/plugin') }, (err, rendered, config) => {

                expect(err).not.to.exist();

                server.route([
                    {
                        path: '/view', method: 'GET', handler: function (request, reply) {

                            return reply(rendered);
                        }
                    }
                ]);

                return next();
            });
        };

        test.attributes = {
            name: 'test'
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.register(test, (err) => {

            expect(err).to.not.exist();
            server.inject('/view', (res) => {

                expect(res.result).to.equal('<h1>steve</h1>');
                done();
            });
        });
    });

    it('throws on missing views', (done) => {

        const server = new Hapi.Server();
        server.register(Vision, Hoek.ignore);
        expect(() => {

            server.render('test');
        }).to.throw('Missing views manager');
        done();
    });

    it('renders view (plugin request)', (done) => {

        const test = function (server, options, next) {

            server.views({
                engines: { 'html': Handlebars },
                relativeTo: Path.join(__dirname, '/templates/plugin')
            });

            server.route({
                method: 'GET',
                path: '/view',
                handler: function (request, reply) {

                    request.render('test', { message: 'steve' }, (err, rendered, config) => {

                        expect(err).not.to.exist();
                        return reply(rendered);
                    });
                }
            });

            return next();
        };

        test.attributes = {
            name: 'test'
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.register(test, (err) => {

            expect(err).to.not.exist();
            server.inject('/view', (res) => {

                expect(res.result).to.equal('<h1>steve</h1>');
                done();
            });
        });
    });

    it('does not pass the request to the global context function (server)', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates/valid',

            context: (request) => {

                return {
                    message: request ? request.route.path : 'default'
                };
            }
        });

        server.render('testContext', null, null, (err, result) => {

            expect(err).not.to.exist();
            expect(result).to.contain('<h1>default</h1>');
            done();
        });
    });

    it('does not pass the request to the global context function (request)', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates/valid',

            context: (request) => {

                return {
                    message: request ? request.route.path : 'default'
                };
            }
        });

        const handler = (request, reply) => {

            request.render('testContext', null, null, (err, rendered) => {

                expect(err).not.to.exist();
                reply(rendered);
            });
        };

        server.route({ method: 'GET', path: '/', handler });
        server.inject({ method: 'GET', url: '/' }, (response) => {

            expect(response.result).to.contain('<h1>default</h1>');
            done();
        });
    });

    it('returns a promise when no options or callback given (server)', () => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);
        server.views({
            engines: { html: Handlebars },
            path: __dirname + '/templates/valid'
        });

        return server.render('test', { message: 'Hello!' })
        .then((content) => expect(content).to.contain('<h1>Hello!</h1>'));
    });

    it('returns a promise when no callback given (server)', () => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { html: Handlebars },
            path: __dirname + '/templates/valid'
        });

        return server.render('test', { message: 'Hello!' }, {})
        .then((content) => expect(content).to.contain('<h1>Hello!</h1>'));
    });

    it('returns a promise when no options or callback given (request)', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { html: Handlebars },
            path: __dirname + '/templates/valid'
        });

        const handler = (request, reply) => {

            const promise = request.render('test', { message: 'Hello!' });
            expect(promise).to.be.an.instanceof(Promise);
            reply(promise);
        };

        server.route({ method: 'GET', path: '/', handler });
        server.inject({ method: 'GET', url: '/' }, (response) => {

            expect(response.result).to.contain('<h1>Hello!</h1>');
            done();
        });
    });

    it('returns a promise when no callback given (request)', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { html: Handlebars },
            path: __dirname + '/templates/valid'
        });

        const handler = (request, reply) => {

            const promise = request.render('test', { message: 'Hello!' }, {});
            expect(promise).to.be.an.instanceof(Promise);
            reply(promise);
        };

        server.route({ method: 'GET', path: '/', handler });
        server.inject({ method: 'GET', url: '/' }, (response) => {

            expect(response.result).to.contain('<h1>Hello!</h1>');
            done();
        });
    });
});

describe('views()', () => {

    it('requires plugin with views', (done) => {

        const test = function (server, options, next) {

            server.path(__dirname);

            const views = {
                engines: { 'html': Handlebars },
                path: './templates/plugin'
            };

            server.views(views);
            if (Object.keys(views).length !== 2) {
                return next(new Error('plugin.view() modified options'));
            }

            server.route([
                {
                    path: '/view', method: 'GET', handler: function (request, reply) {

                        return reply.view('test', { message: options.message });
                    }
                }
            ]);

            server.ext('onRequest', (request, reply) => {

                if (request.path === '/ext') {
                    return reply.view('test', { message: 'grabbed' });
                }

                return reply.continue();
            });

            return next();
        };

        test.attributes = {
            name: 'test'
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.register({ register: test, options: { message: 'viewing it' } }, (err) => {

            expect(err).to.not.exist();
            server.inject('/view', (viewResponse) => {

                expect(viewResponse.result).to.equal('<h1>viewing it</h1>');

                server.inject('/ext', (extResponse) => {

                    expect(extResponse.result).to.equal('<h1>grabbed</h1>');
                    done();
                });
            });
        });
    });

    it('requires plugin with views with specific relativeTo', (done) => {

        const test = function (server, options, next) {

            server.views({
                engines: { 'html': Handlebars },
                relativeTo: Path.join(__dirname, '/templates/plugin')
            });

            server.route([
                {
                    path: '/view', method: 'GET', handler: function (request, reply) {

                        return reply.view('test', { message: 'steve' });
                    }
                }
            ]);

            return next();
        };

        test.attributes = {
            name: 'test'
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.register(test, (err) => {

            expect(err).to.not.exist();
            server.inject('/view', (res) => {

                expect(res.result).to.equal('<h1>steve</h1>');
                done();
            });
        });
    });

    it('defaults to server views', (done) => {

        const test = function (server, options, next) {

            server.route({
                path: '/view',
                method: 'GET',
                handler: function (request, reply) {

                    return reply.view('test', { message: options.message });
                }
            });

            return next();
        };

        test.attributes = {
            name: 'test'
        };

        const server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.path(__dirname);

        const views = {
            engines: { 'html': Handlebars },
            path: './templates/plugin'
        };

        server.views(views);

        server.register({ register: test, options: { message: 'viewing it' } }, (err) => {

            expect(err).to.not.exist();
            server.inject('/view', (res) => {

                expect(res.result).to.equal('<h1>viewing it</h1>');
                done();
            });
        });
    });

    it('throws on multiple views', (done) => {

        const server = new Hapi.Server();
        server.register(Vision, Hoek.ignore);
        server.views({ engines: { 'html': Handlebars } });
        expect(() => {

            server.views({ engines: { 'html': Handlebars } });
        }).to.throw('Cannot set views manager more than once');
        done();
    });

    it('can register helpers via the view manager', (done) => {

        const server = new Hapi.Server();
        server.register(Vision, Hoek.ignore);

        const manager = server.views({
            engines: { 'html': Handlebars.create() },
            relativeTo: 'test/templates',
            path: 'valid'
        });

        manager.registerHelper('long', (string) => string);
        manager.registerHelper('uppercase', (string) => string);

        server.render('testHelpers', { something: 'uppercase' }, (err, result) => {

            expect(err).not.to.exist();
            expect(result).to.equal('<p>This is all uppercase and this is how we like it!</p>');
            done();
        });
    });

    it('can render templates via the view manager', (done) => {

        const server = new Hapi.Server();
        server.register(Vision, Hoek.ignore);

        const manager = server.views({
            engines: { 'html': Handlebars },
            relativeTo: 'test/templates',
            path: 'valid'
        });

        manager.render('test', { message: 'Hello!' }, null, (err, result) => {

            expect(err).not.to.exist();
            expect(result).to.contain('<h1>Hello!</h1>');
            done();
        });
    });
});

describe('Plugin', () => {

    it('can be registered before connections', (done) => {

        const plugin = function (server, options, next) {

            server.dependency('vision');
            server.connection();
            next();
        };

        plugin.attributes = {
            connections: false,
            name: 'test'
        };

        const server = new Hapi.Server();
        server.register([Vision, plugin], Hoek.ignore);

        expect(server.views).to.be.a.function();
        server.initialize((err) => {

            expect(err).to.not.exist();
            server.stop(done);
        });
    });

    it('only registers once', (done) => {

        const one = function (server, options, next) {

            server.register(Vision, next);
        };

        const two = function (server, options, next) {

            server.register(Vision, next);
        };

        one.attributes = { name: 'one' };
        two.attributes = { name: 'two' };

        const server = new Hapi.Server();
        server.register([one, two], (err) => {

            expect(err).to.not.exist();
            done();
        });
    });
});
