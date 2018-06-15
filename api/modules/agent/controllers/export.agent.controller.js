'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const withReferences = request.query.withReferences;
    const server = request.server;

    Async.waterfall([

        (callbackGetAgent) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200) {
                    if (res.statusCode === 404) {
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return callbackGetAgent(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the agent');
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

                                if (res.statusCode !== 200) {
                                    const error = Boom.create(res.statusCode, `An error occurred getting the list of domains of the agent ${exportedAgent.agent}`);
                                    return callbackGetDomains(error, null);
                                }
                                return callbackGetDomains(null, res.result.domains);
                            });
                        },
                        (exportedDomains, callbackGetDomainIntentAndScenarios) => {

                            Async.map(exportedDomains, (exportedDomain, callbackGetDataDomain) => {

                                Async.waterfall([
                                    (callbackGetIntentsFromDomain) => {

                                        server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/intent`, (res) => {

                                            if (res.statusCode !== 200) {
                                                const error = Boom.create(res.statusCode, `An error occurred getting the list of intents for domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                return callbackGetIntentsFromDomain(error, null);
                                            }
                                            if (!withReferences) {
                                                res.result.intents.forEach((domainIntent) => {

                                                    domainIntent.examples.forEach((example) => {

                                                        example.entities.forEach((exampleEntity) => {

                                                            delete exampleEntity.entityId;
                                                        });
                                                    });
                                                });
                                            }
                                            return callbackGetIntentsFromDomain(null, res.result.intents);
                                        });
                                    },
                                    (exportedIntentsForDomain, callbackGetScenarioForEachIntent) => {

                                        Async.map(exportedIntentsForDomain, (exportedIntentForDomain, callbackGetIntentScenario) => {

                                            server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/intent/${exportedIntentForDomain.id}/scenario`, (res) => {

                                                if (res.statusCode !== 200) {
                                                    if (res.statusCode === 404) {
                                                        return callbackGetIntentScenario(null, exportedIntentForDomain);
                                                    }
                                                    const error = Boom.create(res.statusCode, `An error occurred getting the scenario of intent ${exportedIntentForDomain.intent} in domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                    return callbackGetIntentScenario(error, null);
                                                }
                                                if (!withReferences) {
                                                    delete res.result.id;
                                                    delete res.result.agent;
                                                    delete res.result.domain;
                                                    delete res.result.intent;
                                                }
                                                return callbackGetIntentScenario(null, Object.assign(exportedIntentForDomain, { scenario: res.result }));
                                            });
                                        }, (err, intentsWithScenarios) => {

                                            if (err) {
                                                return callbackGetScenarioForEachIntent(err);
                                            }
                                            return callbackGetScenarioForEachIntent(null, intentsWithScenarios);
                                        });
                                    },
                                    (exportedIntentsForDomain, callbackGetWebhookForEachIntent) => {

                                        Async.map(exportedIntentsForDomain, (exportedIntentForDomain, callbackGetIntentWebhook) => {

                                            server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/intent/${exportedIntentForDomain.id}/webhook`, (res) => {

                                                if (res.statusCode !== 200) {
                                                    if (res.statusCode === 404) {

                                                        return callbackGetIntentWebhook(null, exportedIntentForDomain);
                                                    }
                                                    const error = Boom.create(res.statusCode, `An error occurred getting the webhook of intent ${exportedIntentForDomain.intent} in domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                    return callbackGetIntentWebhook(error, null);
                                                }
                                                if (!withReferences) {
                                                    delete res.result.id;
                                                    delete res.result.agent;
                                                    delete res.result.domain;
                                                    delete res.result.intent;
                                                }
                                                return callbackGetIntentWebhook(null, Object.assign(exportedIntentForDomain, { webhook: res.result }));
                                            });
                                        }, (err, intentsWithWebhooks) => {

                                            if (err) {
                                                return callbackGetWebhookForEachIntent(err);
                                            }
                                            return callbackGetWebhookForEachIntent(null, intentsWithWebhooks);
                                        });
                                    },

                                    (exportedIntentsForDomain, callbackGetPostFormatForEachIntent) => {

                                        Async.map(exportedIntentsForDomain, (exportedIntentForDomain, callbackGetIntentPostFormat) => {

                                            server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/intent/${exportedIntentForDomain.id}/postFormat`, (res) => {

                                                if (res.statusCode !== 200 ) {
                                                    if (res.statusCode === 404) {
                                                        if (!withReferences) {
                                                            delete exportedIntentForDomain.id;
                                                            delete exportedIntentForDomain.agent;
                                                            delete exportedIntentForDomain.domain;
                                                        }
                                                        return callbackGetIntentPostFormat(null, exportedIntentForDomain);

                                                        const error = Boom.create(res.statusCode, `An error occurred getting the post format of intent ${exportedIntentForDomain.intentName} in domain ${exportedDomain.domainName} of the agent ${exportedAgent.agentName}`);
                                                        return callbackGetIntentPostFormat(error, null);
                                                    }
                                                }
                                                if (!withReferences) {
                                                    delete res.result.id;
                                                    delete res.result.agent;
                                                    delete res.result.domain;
                                                    delete res.result.intent;
                                                    delete exportedIntentForDomain.id;
                                                    delete exportedIntentForDomain.agent;
                                                    delete exportedIntentForDomain.domain;
                                                }
                                                return callbackGetIntentPostFormat(null, Object.assign(exportedIntentForDomain, { postFormat: res.result }));
                                            });
                                        }, (err, intentsWithPostFormats) => {

                                            if (err) {
                                                return callbackGetPostFormatForEachIntent(err);
                                            }
                                            return callbackGetPostFormatForEachIntent(null, intentsWithPostFormats);
                                        });
                                    }
                                ], (err, intentsWithScenariosAndWebhooksAndPostFormat) => {

                                    if (err) {
                                        return callbackGetDataDomain(err);
                                    }

                                    if (!withReferences) {

                                        delete exportedDomain.id;
                                        delete exportedDomain.agent;
                                    }
                                    return callbackGetDataDomain(null, Object.assign(exportedDomain, { intents: intentsWithScenariosAndWebhooksAndPostFormat }));
                                });
                            }, (err, domainsWithIntents) => {

                                if (err) {
                                    return callbackGetDomainIntentAndScenarios(err);
                                }
                                return callbackGetDomainIntentAndScenarios(null, Object.assign(exportedAgent, { domains: domainsWithIntents }));
                            });
                        }
                    ], (err, agentWithDomains) => {

                        if (err) {
                            return callbackGetDomainsData(err);
                        }
                        return callbackGetDomainsData(null, agentWithDomains);
                    });
                },
                entities: (callbackGetEntities) => {

                    server.inject(`/agent/${agentId}/entity`, (res) => {

                        if (res.statusCode !== 200) {
                            const error = Boom.create(res.statusCode, `An error occurred getting the list of entities of agent ${exportedAgent.agentName}`);
                            return callbackGetEntities(error, null);
                        }
                        if (!withReferences) {

                            res.result.entities.forEach((entity) => {

                                delete entity.id;
                                delete entity.agent;
                            });
                        }
                        return callbackGetEntities(null, Object.assign(exportedAgent, { entities: res.result.entities }));
                    });
                },
                webhook: (callbackGetWebhook) => {

                    server.inject(`/agent/${agentId}/webhook`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                return callbackGetWebhook(null, exportedAgent);
                            }
                            const error = Boom.create(res.statusCode, `An error occurred getting the webhook of the agent ${exportedAgent.agentName}`);
                            return callbackGetWebhook(error, null);
                        }

                        if (!withReferences) {

                            delete res.result.id;
                            delete res.result.agent;
                        }
                        return callbackGetWebhook(null, Object.assign(exportedAgent, { webhook: res.result }));
                    });
                },
                postFormat: (callbackGetPostFormat) => {

                    server.inject(`/agent/${agentId}/postFormat`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                return callbackGetPostFormat(null, exportedAgent);
                            }
                            const error = Boom.create(res.statusCode, `An error occurred getting the postFormat of the agent ${exportedAgent.agentName}`);
                            return callbackGetPostFormat(error, null);
                        }

                        if (!withReferences) {

                            delete res.result.id;
                            delete res.result.agent;
                        }
                        return callbackGetPostFormat(null, Object.assign(exportedAgent, { postFormat: res.result }));
                    });
                },
                settings: (callbackGetSettings) => {

                    server.inject(`/agent/${agentId}/settings`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                return callbackGetSettings(null, exportedAgent);
                            }
                            const error = Boom.create(res.statusCode, `An error occurred getting the settings of the agent ${exportedAgent.agentName}`);
                            return callbackGetSettings(error, null);
                        }
                        return callbackGetSettings(null, Object.assign(exportedAgent, { settings: res.result }));
                    });
                }
            }, (err) => {

                if (err) {
                    return callbackGetAgentEntitiesAndDomains(err);
                }
                if (!withReferences) {

                    delete exportedAgent.id;
                }
                return callbackGetAgentEntitiesAndDomains(null, exportedAgent);
            });
        }
    ], (err, data) => {

        if (err) {
            return reply(err);
        }

        return reply(data);
    });

};
