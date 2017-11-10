'use strict';

const Wreck = require('wreck');
const Boom = require('boom');

const BuildDomainRecognitionTrainingData = require('./buildDomainRecognitionTrainingData.intent.tool');

const retrainDomainRecognizer = (server, rasa, agentName, agentId, cb) => {

    BuildDomainRecognitionTrainingData(server, agentId, (err, trainingSet) => {

        if (err){
            return cb(err);
        }

        if (!trainingSet){
            return cb(null);
        }

        const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
        const trainingDate = new Date().toISOString();
        const modelFolderName = agentName + '-domain-recognizer' + '_' + trainingDate.replace(new RegExp(':', 'g'), '');
        Wreck.post(`${rasa}/train?project=${agentName}&fixed_model_name=${modelFolderName}`, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {
            
            if (err) {
                return cb(err);
            }

            return cb(null);
        });

    });
};

module.exports = retrainDomainRecognizer;
