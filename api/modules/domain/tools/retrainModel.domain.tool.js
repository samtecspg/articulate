'use strict';

const Wreck = require('wreck');
const Boom = require('boom');
const Guid = require('guid');
const BuildTrainingData = require('./buildTrainingData.domain.tool');
const YAML = require('json2yaml');

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
        let requestPayload = {
            language
        };
        if (trainingSet.numberOfIntents === 1){
            requestPayload['pipeline'] = server.app.rasa_er_pipeline;
        }
        requestPayload = YAML.stringify(requestPayload);
        requestPayload += `  data: ${stringTrainingSet}`;
        Wreck.post(`${rasa}/train?project=${agentName}&fixed_model_name=${modelFolderName}`, { 
            payload: requestPayload,
            headers: {
                'Content-Type': 'application/x-yml'
            }
        }, (err, wreckResponse, payload) => {

            if (err) {
                const error = Boom.badImplementation('An error occurred calling the training process.');
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
