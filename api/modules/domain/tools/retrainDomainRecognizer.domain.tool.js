'use strict';

const Wreck = require('wreck');
const Boom = require('boom');

const BuildDomainRecognitionTrainingData = require('./buildDomainRecognitionTrainingData.domain.tool');

const retrainDomainRecognizer = (server, redis, rasa, language, agentName, agentId, cb) => {

    BuildDomainRecognitionTrainingData(server, agentId, (err, trainingSet) => {

        if (err){
            return cb(err);
        }

        if (!trainingSet){
            return cb(null);
        }

        const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
        const trainingDate = new Date().toISOString();
        const modelFolderName = agentName + '_domain_recognizer';
        Wreck.post(`${rasa}/train?project=${agentName}&fixed_model_name=${modelFolderName}`, { payload: stringTrainingSet }, (err, wreckResponse, payload) => {

            if (err) {
                return cb(err);
            }
            redis.lpush(`agentDomainRecognizer:${agentId}`, trainingDate, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error saving the training date of the domain recognizer.');
                    return cb(error);
                }
                return cb(null);
            });
        });

    });
};

module.exports = retrainDomainRecognizer;
