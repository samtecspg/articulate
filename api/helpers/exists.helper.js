'use strict';
const Boom = require('boom');
const debug = require('debug')('nlu:helpers:exists');

const exists = (elasticsearchClient, index, id, callback) => {

    //This means the payload doesn't contain this value. So there isn't need to check it
    if (id) {
        elasticsearchClient.exists({
            index,
            type: 'default',
            id
        }, (err, existsResult) => {

            if (err) {
                debug('ElasticSearch - exists helper: Error= %o', err);
                const error = Boom.badImplementation('An error ocurred calling ES to validate data');
                return callback(error);
            }
            if (existsResult){
                return callback(null);
            }
            const error = Boom.badRequest('The document with id ' + id + ' doesn\'t exists in index ' + index);
            return callback(error);
        });
    }
    else {
        return callback(null);
    }
};

module.exports = exists;
