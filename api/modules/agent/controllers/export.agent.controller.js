'use strict';
const Async = require('async');
const Boom = require('boom');

// TODO: PATH 1.2 (1)
module.exports = (request, reply) => {

    const agentId = request.params.id;
    const withReferences = request.query.withReferences;
    const server = request.server;

    Async.waterfall([

        (callbackGetAgent) => {
            // TODO: PATH 1.1.1 (2)
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
        (exportedAgent, callbackGetAgentKeywordsAndDomains) => {

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
                        (exportedDomains, callbackGetDomainSayingAndScenarios) => {

                            Async.map(exportedDomains, (exportedDomain, callbackGetDataDomain) => {

                                Async.waterfall([
                                    (callbackGetSayingsFromDomain) => {

                                        server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/saying`, (res) => {

                                            if (res.statusCode !== 200) {
                                                const error = Boom.create(res.statusCode, `An error occurred getting the list of sayings for domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                return callbackGetSayingsFromDomain(error, null);
                                            }
                                            if (!withReferences) {
                                                res.result.sayings.forEach((domainSaying) => {

                                                    domainSaying.examples.forEach((example) => {

                                                        example.keywords.forEach((exampleKeyword) => {

                                                            delete exampleKeyword.keywordId;
                                                        });
                                                    });
                                                });
                                            }
                                            return callbackGetSayingsFromDomain(null, res.result.sayings);
                                        });
                                    },
                                    (exportedSayingsForDomain, callbackGetScenarioForEachSaying) => {

                                        Async.map(exportedSayingsForDomain, (exportedSayingForDomain, callbackGetSayingScenario) => {

                                            server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/saying/${exportedSayingForDomain.id}/scenario`, (res) => {

                                                if (res.statusCode !== 200) {
                                                    if (res.statusCode === 404) {
                                                        return callbackGetSayingScenario(null, exportedSayingForDomain);
                                                    }
                                                    const error = Boom.create(res.statusCode, `An error occurred getting the scenario of saying ${exportedSayingForDomain.saying} in domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                    return callbackGetSayingScenario(error, null);
                                                }
                                                if (!withReferences) {
                                                    delete res.result.id;
                                                    delete res.result.agent;
                                                    delete res.result.domain;
                                                    delete res.result.saying;
                                                }
                                                return callbackGetSayingScenario(null, Object.assign(exportedSayingForDomain, { scenario: res.result }));
                                            });
                                        }, (err, sayingsWithScenarios) => {

                                            if (err) {
                                                return callbackGetScenarioForEachSaying(err);
                                            }
                                            return callbackGetScenarioForEachSaying(null, sayingsWithScenarios);
                                        });
                                    },
                                    (exportedSayingsForDomain, callbackGetWebhookForEachSaying) => {

                                        Async.map(exportedSayingsForDomain, (exportedSayingForDomain, callbackGetSayingWebhook) => {

                                            server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/saying/${exportedSayingForDomain.id}/webhook`, (res) => {

                                                if (res.statusCode !== 200) {
                                                    if (res.statusCode === 404) {

                                                        return callbackGetSayingWebhook(null, exportedSayingForDomain);
                                                    }
                                                    const error = Boom.create(res.statusCode, `An error occurred getting the webhook of saying ${exportedSayingForDomain.saying} in domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                    return callbackGetSayingWebhook(error, null);
                                                }
                                                if (!withReferences) {
                                                    delete res.result.id;
                                                    delete res.result.agent;
                                                    delete res.result.domain;
                                                    delete res.result.saying;
                                                }
                                                return callbackGetSayingWebhook(null, Object.assign(exportedSayingForDomain, { webhook: res.result }));
                                            });
                                        }, (err, sayingsWithWebhooks) => {

                                            if (err) {
                                                return callbackGetWebhookForEachSaying(err);
                                            }
                                            return callbackGetWebhookForEachSaying(null, sayingsWithWebhooks);
                                        });
                                    },

                                    (exportedSayingsForDomain, callbackGetPostFormatForEachSaying) => {

                                        Async.map(exportedSayingsForDomain, (exportedSayingForDomain, callbackGetSayingPostFormat) => {

                                            server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/saying/${exportedSayingForDomain.id}/postFormat`, (res) => {

                                                if (res.statusCode !== 200 ) {
                                                    if (res.statusCode === 404) {
                                                        if (!withReferences) {
                                                            delete exportedSayingForDomain.id;
                                                            delete exportedSayingForDomain.agent;
                                                            delete exportedSayingForDomain.domain;
                                                        }
                                                        return callbackGetSayingPostFormat(null, exportedSayingForDomain);

                                                        const error = Boom.create(res.statusCode, `An error occurred getting the post format of saying ${exportedSayingForDomain.sayingName} in domain ${exportedDomain.domainName} of the agent ${exportedAgent.agentName}`);
                                                        return callbackGetSayingPostFormat(error, null);
                                                    }
                                                }
                                                if (!withReferences) {
                                                    delete res.result.id;
                                                    delete res.result.agent;
                                                    delete res.result.domain;
                                                    delete res.result.saying;
                                                    delete exportedSayingForDomain.id;
                                                    delete exportedSayingForDomain.agent;
                                                    delete exportedSayingForDomain.domain;
                                                }
                                                return callbackGetSayingPostFormat(null, Object.assign(exportedSayingForDomain, { postFormat: res.result }));
                                            });
                                        }, (err, sayingsWithPostFormats) => {

                                            if (err) {
                                                return callbackGetPostFormatForEachSaying(err);
                                            }
                                            return callbackGetPostFormatForEachSaying(null, sayingsWithPostFormats);
                                        });
                                    }
                                ], (err, sayingsWithScenariosAndWebhooksAndPostFormat) => {

                                    if (err) {
                                        return callbackGetDataDomain(err);
                                    }

                                    if (!withReferences) {

                                        delete exportedDomain.id;
                                        delete exportedDomain.agent;
                                    }
                                    return callbackGetDataDomain(null, Object.assign(exportedDomain, { sayings: sayingsWithScenariosAndWebhooksAndPostFormat }));
                                });
                            }, (err, domainsWithSayings) => {

                                if (err) {
                                    return callbackGetDomainSayingAndScenarios(err);
                                }
                                return callbackGetDomainSayingAndScenarios(null, Object.assign(exportedAgent, { domains: domainsWithSayings }));
                            });
                        }
                    ], (err, agentWithDomains) => {

                        if (err) {
                            return callbackGetDomainsData(err);
                        }
                        return callbackGetDomainsData(null, agentWithDomains);
                    });
                },
                keywords: (callbackGetKeywords) => {

                    server.inject(`/agent/${agentId}/keyword`, (res) => {

                        if (res.statusCode !== 200) {
                            const error = Boom.create(res.statusCode, `An error occurred getting the list of keywords of agent ${exportedAgent.agentName}`);
                            return callbackGetKeywords(error, null);
                        }
                        if (!withReferences) {

                            res.result.keywords.forEach((keyword) => {

                                delete keyword.id;
                                delete keyword.agent;
                            });
                        }
                        return callbackGetKeywords(null, Object.assign(exportedAgent, { keywords: res.result.keywords }));
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
                    return callbackGetAgentKeywordsAndDomains(err);
                }
                if (!withReferences) {

                    delete exportedAgent.id;
                }
                return callbackGetAgentKeywordsAndDomains(null, exportedAgent);
            });
        }
    ], (err, data) => {

        if (err) {
            return reply(err);
        }

        return reply(data);
    });

};
