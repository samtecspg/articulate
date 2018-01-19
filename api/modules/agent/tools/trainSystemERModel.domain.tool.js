'use strict';

const Wreck = require('wreck');
const Boom = require('boom');
const ERPipeline = require('../../../rasa-er-pipeline.json');

const trainSystemERModel = (server, rasa, agentName, callback) => {

    const trainingSet = {
        rasa_nlu_data: {
            common_examples: []
        }
    };
    const stringTrainingSet = JSON.stringify(trainingSet, null, 2);

    const modelFolderName = agentName + '_ER';
    const pipeline = ERPipeline.join(',');
    Wreck.post(`${rasa}/train?project=${agentName}&fixed_model_name=${modelFolderName}&pipeline=${pipeline}`, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {

        if (err) {
            const error = Boom.badImplementation('An error ocurred calling the training process.');
            return callback(error);
        }
        return callback(null);
    });
};

module.exports = trainSystemERModel;
