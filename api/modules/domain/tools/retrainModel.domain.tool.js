'use strict';

const Wreck = require('wreck');
const Boom = require('boom');
const Guid = require('guid');
const BuildTrainingData = require('./buildTrainingData.domain.tool');

const retrainModel = (server, rasa, language, agentName, domainName, domainId, callback) => {

    BuildTrainingData(server, domainId, (err, trainingSet) => {

        if (err){
            return callback(err);
        }

        const stringTrainingSet = JSON.stringify(trainingSet.trainingSet, null, 2);
        const trainingDate = new Date().toISOString();
        let model = Guid.create().toString();
        model = (trainingSet.numberOfIntents > 1 ? '' : 'just_er_') + model;
        const modelFolderName = domainName + '_' + model;
        const pipeline = trainingSet.numberOfIntents > 1 ? null : server.app.rasa_er_pipeline.join(',');
        Wreck.post(`${rasa}/train?project=${agentName}&fixed_model_name=${modelFolderName}${pipeline ? `&pipeline=${pipeline}` : ''}`, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {

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
