'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const server = request.server;
    const redis = server.app.redis;

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
                                    const error = Boom.create(res.statusCode, 'An error ocurred getting the data of the agent');
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
                                                const error = Boom.create(res.statusCode, 'An error ocurred getting the data of the agent');
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
                                                    const error = Boom.create(res.statusCode, 'An error ocurred getting the data of the agent');
                                                    return callbackGetIntentScenario(error, null);
                                                }
                                                return callbackGetIntentScenario(null, Object.assign(exportedIntentForDomain, {scenario: res.result}));
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
                                    return callbackGetDataDomain(null, Object.assign(exportedDomain, {intents: intentsWithScenarios}));
                                })
                            }, (err, domainsWithIntents) => {

                                if (err){
                                    return callbackGetDomainIntentAndScenarios(err);
                                }
                                return callbackGetDomainIntentAndScenarios(null, Object.assign(exportedAgent, {domains: domainsWithIntents}));
                            });
                        }
                    ], (err, agentWithDomains) => {

                        if (err){
                            return callbackGetDomainsData(err);
                        }
                        return callbackGetDomainsData(null, agentWithDomains);
                    })
                },
                entities: (callbackGetEntities) => {

                    server.inject(`/agent/${agentId}/entity`, (res) => {
                        
                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, 'An error ocurred getting the data of the agent');
                            return callbackGetEntities(error, null);
                        }
                        return callbackGetEntities(null, Object.assign(exportedAgent, {entities: res.result}));
                    });
                }
            }, (err) => {

                if (err){
                    return callbackGetAgentEntitiesAndDomains(err);
                }
                return callbackGetAgentEntitiesAndDomains(null, exportedAgent);
            })
        }
    ], (err, data) => {

        if (err){
            return reply(err);
        }

        return reply(data);
    });

};
