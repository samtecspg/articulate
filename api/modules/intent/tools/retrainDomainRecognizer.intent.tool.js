'use strict';

const Wreck = require('wreck');
const Boom = require('boom');

const BuildTrainingData = require('./buildTrainingData.intent.tool');
const debug = require('debug')('nlu:model:Intent:tool:retrainModel');

const retrainDomainRecognizer = (elasticsearch, rasa, server, action, intent, callback) => {

    BuildTrainingData(elasticsearch, intent, action, true, (err, trainingSet) => {

        if (err){
            return callback(err);
        }

        if (!trainingSet){
            return callback(null);
        }

        const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
        const trainingDate = new Date().toISOString();
        const modelFolderName = intent.agent + '-domain-recognizer' + '_' + trainingDate.replace(new RegExp(':', 'g'), '');
        Wreck.post(rasa + '/train?name=' + modelFolderName, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {

            if (err) {
                debug('ElasticSearch - retrainModel tool: Error= %o', err);
                return callback(err);
            }

            elasticsearch.index({
                index: 'domain',
                type: 'default',
                id: intent.agent + '-domain-recognizer',
                body: {
                    agent: intent.agent,
                    domainName: 'Agent Domain Recognizer',
                    enabled: true,
                    intentThreshold: 0,
                    lastTraining: trainingDate
                }
            }, (errorIndexing, response) => {

                if (errorIndexing){
                    debug('ElasticSearch - add intent: Error= %o', errorIndexing);
                    const error = Boom.create(errorIndexing.statusCode, errorIndexing.message, errorIndexing.body ? errorIndexing.body : null);
                    if (errorIndexing.body){
                        error.output.payload.details = error.data;
                    }
                    return callback(error);
                }

                return callback(null);
            });
        });

    });
};

module.exports = retrainDomainRecognizer;
