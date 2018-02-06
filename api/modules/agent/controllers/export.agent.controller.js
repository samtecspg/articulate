'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const server = request.server;

    Async.waterfall([

        (callbackGetAgent) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return callbackGetAgent(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error ocurred getting the data of the agent');
                    return callbackGetAgent(error, null);
                }
                return callbackGetAgent(null, res.result);
            });
        },
        (exportedAgent, callbackGetAgentEntitiesAndDomains) => {

            Async.parallel({
                domains: (callbackGetDomainsData) => {

                    Async.waterfall([
                        (callbackGetDomains) => {

                            server.inject(`/agent/${agentId}/domain`, (res) => {

                                if (res.statusCode !== 200){
                                    const error = Boom.create(res.statusCode, `An error ocurred getting the list of domains of the agent ${exportedAgent.agent}`);
                                    return callbackGetDomains(error, null);
                                }
                                return callbackGetDomains(null, res.result);
                            });
                        },
                        (exportedDomains, callbackGetDomainIntentAndScenarios) => {

                            Async.map(exportedDomains, (exportedDomain, callbackGetDataDomain) => {

                                Async.waterfall([
                                    (callbackGetIntentsFromDomain) => {

                                        server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/intent`, (res) => {

                                            if (res.statusCode !== 200){
                                                const error = Boom.create(res.statusCode, `An error ocurred getting the list of intents for domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                return callbackGetIntentsFromDomain(error, null);
                                            }
                                            return callbackGetIntentsFromDomain(null, res.result);
                                        });
                                    },
                                    (exportedIntentsForDomain, callbackGetScenarioForEachIntent) => {

                                        Async.map(exportedIntentsForDomain, (exportedIntentForDomain, callbackGetIntentScenario) => {

                                            server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/intent/${exportedIntentForDomain.id}/scenario`, (res) => {

                                                if (res.statusCode !== 200){
                                                    if (res.statusCode === 404){
                                                        return callbackGetIntentScenario(null, exportedIntentForDomain);
                                                    }
                                                    const error = Boom.create(res.statusCode, `An error ocurred getting the scenario of intent ${exportedIntentForDomain.intent} in domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                    return callbackGetIntentScenario(error, null);
                                                }
                                                delete exportedIntentForDomain.id;
                                                delete exportedIntentForDomain.agent;
                                                delete exportedIntentForDomain.domain;
                                                delete res.result.id;
                                                delete res.result.agent;
                                                delete res.result.domain;
                                                delete res.result.intent;
                                                return callbackGetIntentScenario(null, Object.assign(exportedIntentForDomain, { scenario: res.result }));
                                            });
                                        }, (err, intentsWithScenarios) => {

                                            if (err){
                                                return callbackGetScenarioForEachIntent(err);
                                            }
                                            return callbackGetScenarioForEachIntent(null, intentsWithScenarios);
                                        });
                                    }
                                ], (err, intentsWithScenarios) => {

                                    if (err){
                                        return callbackGetDataDomain(err);
                                    }
                                    delete exportedDomain.id;
                                    delete exportedDomain.agent;
                                    return callbackGetDataDomain(null, Object.assign(exportedDomain, { intents: intentsWithScenarios }));
                                });
                            }, (err, domainsWithIntents) => {

                                if (err){
                                    return callbackGetDomainIntentAndScenarios(err);
                                }
                                return callbackGetDomainIntentAndScenarios(null, Object.assign(exportedAgent, { domains: domainsWithIntents } ));
                            });
                        }
                    ], (err, agentWithDomains) => {

                        if (err){
                            return callbackGetDomainsData(err);
                        }
                        return callbackGetDomainsData(null, agentWithDomains);
                    });
                },
                entities: (callbackGetEntities) => {

                    server.inject(`/agent/${agentId}/entity`, (res) => {

                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, `An error ocurred getting the list of entities of intent ${exportedAgent.agent}`);
                            return callbackGetEntities(error, null);
                        }
                        res.result.forEach((entity) => {

                            delete entity.id;
                            delete entity.agent;
                        });
                        return callbackGetEntities(null, Object.assign(exportedAgent, { entities: res.result }));
                    });
                }
            }, (err) => {

                if (err){
                    return callbackGetAgentEntitiesAndDomains(err);
                }
                delete exportedAgent.id;
                return callbackGetAgentEntitiesAndDomains(null, exportedAgent);
            });
        }
    ], (err, data) => {

        if (err){
            return reply(err);
        }

        return reply(data);
    });

};
