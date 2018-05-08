'use strict';

const Async = require('async');
const Wreck = require('wreck');
const Boom = require('boom');
const Guid = require('guid');
const BuildTrainingData = require('./buildTrainingData.domain.tool');
const YAML = require('json2yaml');

const retrainModel = (server, rasa, language, agentName, domainName, domainId, callback) => {

    let model = Guid.create().toString();
    Async.waterfall([
        (cb) => {

            BuildTrainingData(server, domainId, (err, trainingSet) => {

                if (err){
                    return cb(err);
                }
                return cb(null, trainingSet);
            });
        },
        (trainingSet, cb) => {

            model = (trainingSet.numberOfIntents === 1 ? 'just_er_' : '') + model;
            server.inject(`/settings/${trainingSet.numberOfIntents === 1 ? 'entity' : 'intent'}ClassifierPipeline`, (res) => {

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
        }
    ], (err) => {

        if (err){
            return callback(err);
        }
        const trainingDate = new Date().toISOString();
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

};

module.exports = retrainModel;
