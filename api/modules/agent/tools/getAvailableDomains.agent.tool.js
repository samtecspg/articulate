'use strict';
const debug = require('debug')('nlu:model:Parse:findAll');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (server, agent, passedDomain, callback) => {

    server.app.elasticsearch.search({
        index: 'domain',
        type: 'default',
        body: {
            query: {
                term: {
                    agent: {
                        value: agent
                    }
                }
            },
            aggs: {
                by_domain: {
                    terms: {
                        field: '_uid',
                        order: {
                            'maxLastTraining': 'desc'
                        }
                    },
                    aggs: {
                        maxLastTraining: {
                            max: {
                                field: 'lastTraining'
                            }
                        }
                    }
                }
            }
        },
        size: 0
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - get available domains: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return callback(error, null);
        }

        let availableDomains = response.aggregations.by_domain.buckets;
        if (availableDomains.length === 0){
            debug('ElasticSearch - get available domains: Error= %o', err);
            const error = Boom.create(400, 'There aren\'t domains in the database please create a domain first');
            return callback(error, null);
        }

        availableDomains = _.filter(availableDomains, (domain) => {

            return domain.maxLastTraining.value;
        });

        if (availableDomains.length === 0){
            debug('ElasticSearch - get available domains: Error= %o', err);
            const error = Boom.create(400, 'There doesn\'t exists trained models. Please train models for the existing domains and try again');
            return callback(error, null);
        }

        if (passedDomain){
            availableDomains = _.filter(availableDomains, (domain) => {

                return domain.key === ('default#' + passedDomain);
            });
            if (availableDomains.length === 0){
                debug('ElasticSearch - get available domains: Error= %o', err);
                const error = Boom.create(400, 'There doesn\'t exists trained models for the specified domain. Please check domain exists and train the domain.');
                return callback(error, null);
            }
        }

        const domains = [];
        availableDomains.forEach( (domain, i) => {

            const domainId = domain.key.replace('default#','');
            const modelFolderName = domainId + '_' + domain.maxLastTraining.value_as_string.replace(new RegExp(':', 'g'), '');
            const formattedDomain = { name: domainId, model: modelFolderName };
            domains.push(formattedDomain);
        });

        return callback(null, domains);
    });

};
