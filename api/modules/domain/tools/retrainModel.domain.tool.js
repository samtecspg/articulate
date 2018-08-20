'use strict';

const Async = require('async');
const Wreck = require('wreck');
const Boom = require('boom');
const Guid = require('guid');
const BuildTrainingData = require('./buildTrainingData.domain.tool');
const YAML = require('json2yaml');

const retrainModel = (server, rasa, language, agentName, agentId, domainName, domainId, extraTrainingData, callback) => {

    let model = Guid.create().toString();
    Async.waterfall([
        (cb) => {

            BuildTrainingData(server, domainId, extraTrainingData, (err, trainingSet) => {

                if (err){
                    return cb(err);
                }
                if (trainingSet.numberOfIntents === 0){
                    const error = {};
                    error.noTrainingData = true;
                    return cb(error);
                }
                return cb(null, trainingSet);
            });
        },
        (trainingSet, cb) => {

            model = (trainingSet.numberOfIntents === 1 ? 'just_er_' : '') + model;
            server.inject(`/agent/${agentId}/settings/${trainingSet.numberOfIntents === 1 ? 'entity' : 'intent'}ClassifierPipeline`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the pipeline');
                    return cb(error, null);
                }
                const stringTrainingSet = JSON.stringify(trainingSet.trainingSet, null, 2);
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

            const modelFolderName = domainName + '_' + model;
            Wreck.post(`${rasa}/train?project=${agentName}&model=${modelFolderName}`, {
                payload: rasaPayload,
                headers: {
                    'Content-Type': 'application/x-yml'
                }
            }, (err, wreckResponse, payload) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred calling the training process.');
                    return cb(error);
                }
                return cb(null);
            });
        },
        (cb) => {

            server.inject(`/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the domain to check old models');
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (domain, cb) => {

            if (!domain.model){
                return cb(null);
            }
            Wreck.delete(`${rasa}/models?project=${agentName}&model=${domain.domainName}_${domain.model}`, {}, (err, wreckResponse, payload) => {

                if (err) {
                    console.log(`The model ${domain.domainName}_${domain.model} wasn't unloaded`);
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
        const updateDomainPayload = {
            lastTraining: trainingDate,
            model
        };

        const options = {
            url: `/domain/${domainId}`,
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

};

module.exports = retrainModel;
