'use strict';
// Load modules

const Path = require('path');
const Hapi = require('hapi');
const Pages = require('./pages');
const Vision = require('../..');


// Declare internals

const internals = {};


const view = function (viewName) {

    return function (request, reply) {

        return reply.view(viewName, { title: viewName });
    };
};


const getPages = function (request, reply) {

    return reply.view('index', { pages: Object.keys(Pages.getAll()), title: 'All pages' });
};


const getPage = function (request, reply) {

    return reply.view('page', { page: Pages.getPage(request.params.page), title: request.params.page });
};


const createPage = function (request, reply) {

    Pages.savePage(request.payload.name, request.payload.contents);
    return reply.view('page', { page: Pages.getPage(request.payload.name), title: 'Create page' });
};


const showEditForm = function (request, reply) {

    return reply.view('edit', { page: Pages.getPage(request.params.page), title: 'Edit: ' + request.params.page });
};


const updatePage = function (request, reply) {

    Pages.savePage(request.params.page, request.payload.contents);
    return reply.view('page', { page: Pages.getPage(request.params.page), title: request.params.page });
};


internals.main = function () {

    const server = new Hapi.Server();
    server.connection({ port: 8000, state: { ignoreErrors: true } });
    server.register(Vision, (err) => {

        if (err) {
            throw err;
        }

        server.views({
            engines: { html: require('handlebars') },
            path: Path.join(__dirname, 'views'),
            layout: true,
            partialsPath: Path.join(__dirname, 'views', 'partials')
        });

        server.route({ method: 'GET', path: '/', handler: getPages });
        server.route({ method: 'GET', path: '/pages/{page}', handler: getPage });
        server.route({ method: 'GET', path: '/create', handler: view('create') });
        server.route({ method: 'POST', path: '/create', handler: createPage });
        server.route({ method: 'GET', path: '/pages/{page}/edit', handler: showEditForm });
        server.route({ method: 'POST', path: '/pages/{page}/edit', handler: updatePage });
        server.start((err) => {

            if (err) {
                throw err;
            }

            console.log('Server is listening at ' + server.info.uri);
        });
    });
};


internals.main();
