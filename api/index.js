'use strict';

const Hapi = require('hapi');
const Routes = require('./config/routes');
const ESValidation = require('./config/esValidation');
const Elasticsearch = require('elasticsearch');
const Redis = require('redis');

require('dotenv').load();

module.exports = (callback) => {

    const server = new Hapi.Server();
    server.connection({ port: 8000, routes: { cors: true } });

    const elasticSearchClient = new Elasticsearch.Client({
        host: process.env.ELASTIC_SEARCH_URL,
        httpAuth: process.env.ES_BASIC_AUTH
    });

    server.app.elasticsearch = elasticSearchClient;
    server.app.rasa = process.env.RASA_URL;
    server.app.duckling = process.env.DUCKLING_URL;
    server.app.redis = Redis.createClient();

    /* $lab:coverage:off$ */
    ESValidation.validate(elasticSearchClient, (err, invalidIndex) => {

        if (err){
            callback(err, null);
        }

        if (!invalidIndex){

            for (const route in Routes) {
                if (Routes.hasOwnProperty(route)) {
                    server.route(Routes[route]);
                }
            }
            callback(null, server);

        }
        else {
            console.log('Please check the ' + invalidIndex.index + ' index.');
            console.log('ES index not valid. The server is turning off.');
        }

    } );
    /* $lab:coverage:on$ */
};
