'use strict';
const Async = require('async');
const Boom = require('boom');
const AgentTools = require('../tools');
const DomainTools = require('../../domain/tools');
const Wreck = require('wreck');
const Status = require('../../../helpers/status.json');
const _ = require('lodash');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    let agent = null;
    let rasa = null;
    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (callbackGetAgent) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 400){
                        const errorNotFound = Boom.notFound(res.result.message);
                        return callbackGetAgent(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred get the agent data');
                    return callbackGetAgent(error, null);
                }
                agent = res.result;
                if (agent.status && agent.status === Status.training){
                    const error = Boom.badRequest('The agent is already training, please waint until the current training finish.');
                    return callbackGetAgent(error, null);
                }
                return callbackGetAgent(null);
            });
        },
        (callbackGetRasa) => {

            server.inject(`/agent/${agentId}/settings/rasaURL`, (res) => {

                if (res.statusCode !== 200) {
                    if (res.statusCode === 404) {
                        const errorNotFound = Boom.notFound('The setting rasaURL wasn\'t found');
                        return callbackGetRasa(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the setting rasaURL');
                    return callbackGetRasa(error, null);
                }
                rasa = res.result;
                return callbackGetRasa(null);
            });
        },
        (callbackGetRasaMaxTrainingProcesses) => {

            Wreck.get(`${rasa}/status`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                json: 'force'
            }, (err, wreckResponse, payload) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting rasa status.');
                    return callbackGetRasaMaxTrainingProcesses(error);
                }
                return callbackGetRasaMaxTrainingProcesses(null, payload);
            });
        },
        (rasaStatus, callbackSetAgentTrainingStatus) => {

            redis.hmset(`agent:${agent.id}`, { status: Status.training }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred updating the agent status to training.');
                    return callbackSetAgentTrainingStatus(error);
                }
                return callbackSetAgentTrainingStatus(null, rasaStatus);
            });
        },
        (rasaStatus, callbackTrain) => {

            if (agent.enableModelsPerDomain){
                Async.waterfall([
                    (callbackGetDomains) => {

                        server.inject(`/agent/${agentId}/domain`, (res) => {

                            if (res.statusCode !== 200){
                                const error = Boom.create(res.statusCode, 'An error occurred getting the domains of the agent to train them');
                                return callbackGetDomains(error, null);
                            }
                            return callbackGetDomains(null, res.result.domains);
                        });
                    },
                    (domains, callbackTrainEachDomain) => {

                        const limit = rasaStatus.max_training_processes - rasaStatus.current_training_processes;
                        const needToTrain = _.map(domains, 'status').indexOf(Status.outOfDate) !== -1 || _.map(domains, 'status').indexOf(Status.error) !== -1;
                        if (domains.length > 1){
                            domains.push({ domainRecognizer: true });
                        }
                        if (!needToTrain && domains.length < 2){
                            return callbackTrainEachDomain(null);
                        }
                        Async.eachLimit(domains, limit, (domain, callbackMapOfDomain) => {

                            if (domain.domainRecognizer){
                                DomainTools.retrainDomainRecognizerTool(server, redis, rasa, agent.language, agent.agentName, agent.id, agent.extraTrainingData, (errTraining) => {

                                    if (errTraining){
                                        return callbackMapOfDomain(errTraining);
                                    }
                                    return callbackMapOfDomain(null);
                                });
                            }
                            else {
                                if (domain.status === Status.ready || domain.status === Status.training){
                                    return callbackMapOfDomain(null);
                                }
                                Async.series([
                                    (callbackChangeDomainStatus) => {

                                        redis.hmset(`domain:${domain.id}`, { status: Status.training }, (err) => {

                                            if (err){
                                                const error = Boom.badImplementation('An error occurred updating the domain status.');
                                                return callbackChangeDomainStatus(error);
                                            }
                                            callbackChangeDomainStatus(null);
                                        });
                                    },
                                    (callbackTrainDomain) => {

                                        server.inject(`/domain/${domain.id}/train`, (res) => {

                                            if (res.statusCode === 200){
                                                return callbackTrainDomain(null);
                                            }
                                            const error = Boom.create(res.statusCode, `An error occurred training the domain ${domain.domainName}`);
                                            redis.hmset(`domain:${domain.id}`, { status: Status.error }, (err) => {

                                                if (err){
                                                    error = Boom.badImplementation(`An error ocurred during the training of the domain ${domain.domainName}, and also an error occurred updating the domain status.`);
                                                    return callbackTrainDomain(error);
                                                }
                                                return callbackTrainDomain(error);
                                            });
                                        });
                                    }
                                ], (err) => {

                                    if (err){
                                        return callbackMapOfDomain(err);
                                    }
                                    redis.hmset(`domain:${domain.id}`, { status: Status.ready }, (err) => {

                                        if (err){
                                            const error = Boom.badImplementation('An error occurred updating the domain status.');
                                            return callbackMapOfDomain(error);
                                        }
                                        return callbackMapOfDomain(null);
                                    });
                                });
                            }
                        }, (err) => {

                            if (err){
                                return callbackTrainEachDomain(err);
                            }
                            return callbackTrainEachDomain(null);
                        });
                    }
                ], (err) => {

                    if (err){
                        return callbackTrain(err);
                    }
                    return callbackTrain(null);
                });
            }
            else {
                AgentTools.trainSingleDomain(server, rasa, agent, (err) => {

                    if (err) {
                        return callbackTrain(err);
                    }
                    return callbackTrain(null);
                });
            }
        }
    ], (errTraining) => {

        if (errTraining){
            redis.hmset(`agent:${agent.id}`, { status: Status.error }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred during training, and also an error occurred updating the agent status.');
                    return reply(error);
                }
                return reply(errTraining);
            });
        }
        else {
            const lastTraining = new Date().toISOString();
            redis.hmset(`agent:${agent.id}`, { status: Status.ready, lastTraining }, (err) => {

                if (err){
                    const error = Boom.badImplementation('Model trained. An error occurred updating the agent status to ready.');
                    return reply(error);
                }
                agent.status = Status.ready;
                agent.lastTraining = lastTraining;
                return reply(agent);
            });
        }
    });
};
