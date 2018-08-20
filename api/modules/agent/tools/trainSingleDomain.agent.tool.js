'use strict';

const Async = require('async');
const Wreck = require('wreck');
const Boom = require('boom');
const YAML = require('json2yaml');
const Guid = require('guid');

const BuildSingleDomainTrainingData = require('./buildSingleDomainTrainingData.agent.tool');

const trainSingleDomain = (server, rasa, agent, callback) => {

    let model = Guid.create().toString();
    Async.waterfall([
        (cb) => {

            BuildSingleDomainTrainingData(server, agent.id, agent.extraTrainingData, (err, trainingSet) => {

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
            server.inject(`/agent/${agent.id}/settings/${trainingSet.numberOfIntents === 1 ? 'entity' : 'intent'}ClassifierPipeline`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the pipeline');
                    return cb(error, null);
                }
                const stringTrainingSet = JSON.stringify(trainingSet.trainingSet, null, 2);
                let requestPayload = {
                    language: agent.language
                };
                requestPayload.pipeline = res.result;
                requestPayload = YAML.stringify(requestPayload);
                requestPayload += `  data: ${stringTrainingSet}`;
                return cb(null, requestPayload);
            });
        },
        (rasaPayload, cb) => {

            const modelFolderName = 'default_' + model;
            Wreck.post(`${rasa}/train?project=${agent.agentName}&model=${modelFolderName}`, {
                payload: rasaPayload,
                headers: {
                    'Content-Type': 'application/x-yml'
                }
            }, (err) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred calling the training process.');
                    return cb(error);
                }
                return cb(null);
            });
        },
        (cb) => {

            if (!agent.model){
                return cb(null);
            }
            Wreck.delete(`${rasa}/models?project=${agent.agentName}&model=default_${agent.model}`, {}, (err) => {

                if (err) {
                    console.log(`The model default_${agent.model} wasn't unloaded`);
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

        const updateAgentPayload = {
            model
        };

        const options = {
            url: `/agent/${agent.id}`,
            method: 'PUT',
            payload: updateAgentPayload
        };

        server.inject(options, (res) => {

            if (res.statusCode !== 200) {
                return callback(res.result);
            }
            return callback(null);
        });
    });
};

module.exports = trainSingleDomain;
