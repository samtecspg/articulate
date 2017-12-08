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

        const stringTrainingSet = JSON.stringify(trainingSet.trainingSet, null, 2);
        const trainingDate = new Date().toISOString();
        let model = Guid.create().toString();
        model = (trainingSet.numberOfIntents > 1 ? '' : 'just_er_') + model;
        const modelFolderName = domainName + '_' + model;
        const rasaServer = trainingSet.numberOfIntents > 1 ? rasa : server.app.rasa_er;
        Wreck.post(`${rasaServer}/train?project=${agentName}&fixed_model_name=${modelFolderName}`, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {

            if (err) {
                const error = Boom.badImplementation('An error ocurred calling the training process.');
                return callback(error);
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
