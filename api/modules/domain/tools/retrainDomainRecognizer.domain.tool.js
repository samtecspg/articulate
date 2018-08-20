'use strict';

const Async = require('async');
const Wreck = require('wreck');
const Boom = require('boom');
const YAML = require('json2yaml');

const BuildDomainRecognitionTrainingData = require('./buildDomainRecognitionTrainingData.domain.tool');

const retrainDomainRecognizer = (server, redis, rasa, language, agentName, agentId, extraTrainingData, callback) => {

    Async.waterfall([
        (cb) => {

            BuildDomainRecognitionTrainingData(server, agentId, extraTrainingData, (err, trainingSet) => {

                if (err){
                    return cb(err);
                }
                if (!trainingSet){
                    const error = {};
                    error.noTrainingData = true;
                    return cb(error);
                }
                return cb(null, trainingSet);
            });
        },
        (trainingSet, cb) => {

            server.inject(`/agent/${agentId}/settings/${trainingSet.numberOfIntents === 1 ? 'entity' : 'domain'}ClassifierPipeline`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the pipeline');
                    return cb(error, null);
                }
                const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
                let requestPayload = {
                    language
                };
                requestPayload.pipeline = res.result;
                requestPayload = YAML.stringify(requestPayload);
                requestPayload += `  data: ${stringTrainingSet}`;
                return cb(null, requestPayload);
            });
        },
        (rasaPayload, cb) => {

            const modelFolderName = agentName + '_domain_recognizer';
            Wreck.post(`${rasa}/train?language=${language}&project=${agentName}&model=${modelFolderName}`,{
                payload: rasaPayload,
                headers: {
                    'Content-Type': 'application/x-yml'
                }
            }, (err, wreckResponse, payload) => {

                if (err) {
                    return cb(err);
                }
                return cb(null);
            });
        },
        (cb) => {

            Wreck.delete(`${rasa}/models?project=${agentName}&model=${agentName}_domain_recognizer`, {}, (err, wreckResponse, payload) => {

                if (err) {
                    console.log(`The model ${agentName}_domain_recognizer wasn't unloaded`);
                    return cb(null);
                }
                return cb(null);
            });
        }
    ], (err) => {

        if (err){
            if (err.noTrainingData){
                return callback(null);
            }
            return callback(err);
        }

        const trainingDate = new Date().toISOString();
        redis.lpush(`agentDomainRecognizer:${agentId}`, trainingDate, (err) => {

            if (err){
                const error = Boom.badImplementation('An error saving the training date of the domain recognizer.');
                return callback(error);
            }
            return callback(null);
        });
    });
};

module.exports = retrainDomainRecognizer;
