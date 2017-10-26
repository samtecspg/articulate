'use strict';

const Wreck = require('wreck');

const BuildTrainingData = require('./buildTrainingData.intent.tool');
const debug = require('debug')('nlu:model:Intent:tool:retrainModel');

const retrainModel = (elasticsearch, rasa, server, action, intent, callback) => {

    BuildTrainingData(elasticsearch, intent, action, false, (err, trainingSet) => {

        if (err){
            return callback(err);
        }

        if (!trainingSet){
            return callback(null);
        }

        const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
        const trainingDate = new Date().toISOString();
        const modelFolderName = intent.domain + '_' + trainingDate.replace(new RegExp(':', 'g'), '');
        Wreck.post(rasa + '/train?name=' + modelFolderName, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {

            if (err) {
                debug('ElasticSearch - retrainModel tool: Error= %o', err);
                return callback(err);
            }

            const updateDomainPayload = {
                agent: intent.agent,
                lastTraining: trainingDate
            };

            const options = {
                url: '/domain/' + intent.domain,
                method: 'PUT',
                payload: updateDomainPayload
            };

            server.inject(options, (res) => {

                if (res.statusCode !== 200) {
                    return callback(res.result);
                }
                return callback(null);
            });
        });

    });
};

module.exports = retrainModel;
