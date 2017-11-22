'use strict';

const Wreck = require('wreck');
const Boom = require('boom');
const Guid = require('guid');
const BuildTrainingData = require('./buildTrainingData.intent.tool');

const retrainModel = (server, rasa, agentName, domainName, domainId, callback) => {

    BuildTrainingData(server, domainId, (err, trainingSet) => {

        if (err){
            return callback(err);
        }

        if (!trainingSet){
            return callback(null);
        }

        const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
        const trainingDate = new Date().toISOString();
        const model = Guid.create().toString();
        const modelFolderName = domainName + '_' + model;
        Wreck.post(`${rasa}/train?project=${agentName}&fixed_model_name=${modelFolderName}`, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {

            if (err) {
                const error = Boom.badImplementation('An error ocurred calling the training process.');
                return callback(err);
            }

            const updateDomainPayload = {
                lastTraining: trainingDate,
                model 
            };

            const options = {
                url: '/domain/' + domainId,
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
