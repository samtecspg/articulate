'use strict';
const debug = require('debug')('nlu:model:Intent:tool:updateEntities');
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');

const updateEntities = (elasticsearchClient, intent, callback) => {

    const entitiesByExamples = intent.examples ? _.compact(_.flatten(_.map(intent.examples, 'entities'))) : [];
    const entities = _.uniq(_.map(entitiesByExamples, 'entity'));

    Async.map(entities, (entity, cb) => {

        elasticsearchClient.update({
            index: 'entity',
            type: 'default',
            id: entity,
            body: {
                script : {
                    inline: 'if(ctx._source.usedBy != null){ if(! ctx._source.usedBy.contains(params.domain)){ ctx._source.usedBy.add(params.domain) }}else { ctx._source.put("usedBy", [params.domain]) }',
                    params : {
                        domain : intent.domain
                    }
                }
            }
        }, (err) => {

            if (err){
                debug('ElasticSearch - update entity: Error= %o', err);
                const error = Boom.create(err.statusCode,
                    'The intent was created successfully, but an error ocurred during entity update to add domain. Error: ' + (err.message ? err.message : ''),
                    err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return cb(error, null);
            }

            return cb(null);
        });

    }, (err) => {

        if (err){
            return callback(err, null);
        }

        return callback(null, intent);
    });
};

module.exports = updateEntities;
