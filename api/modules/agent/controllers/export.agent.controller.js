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
                        (exportedDomains, callbackGetDomainSayings) => {

                            Async.map(exportedDomains, (exportedDomain, callbackGetDataDomain) => {

                                Async.parallel({
                                    sayings: (callabckGetSayingsData) => {

                                        server.inject(`/agent/${agentId}/domain/${exportedDomain.id}/saying`, (res) => {

                                            if (res.statusCode !== 200) {
                                                const error = Boom.create(res.statusCode, `An error occurred getting the list of sayings for domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                                return callabckGetSayingsData(error, null);
                                            }
                                            if (!withReferences) {
                                                res.result.sayings.forEach((domainSaying) => {

                                                    delete domainSaying.id;
                                                    delete domainSaying.agent;
                                                    delete domainSaying.domain;
                                                    domainSaying.keywords.forEach((keyword) => {

                                                        delete keyword.keywordId;
                                                    });
                                                });
                                            }
                                            return callabckGetSayingsData(null, res.result.sayings);
                                        });
                                    },
                                }, (err, sayings) => {

                                    if (err) {
                                        return callbackGetDataDomain(err);
                                    }

                                    if (!withReferences) {

                                        delete exportedDomain.id;
                                        delete exportedDomain.agent;
                                    }
                                    return callbackGetDataDomain(null, Object.assign(exportedDomain, sayings));
                                });
                            }, (err, domainsWithSayings) => {

                                if (err) {
                                    return callbackGetDomainSayings(err);
                                }
                                return callbackGetDomainSayings(null, Object.assign(exportedAgent, { domains: domainsWithSayings }));
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
                actions: (callbacGetActionsData) => {

                    Async.waterfall([
                        (callbackGetActionsFromAgent) => {

                            server.inject(`/agent/${agentId}/action`, (res) => {

                                if (res.statusCode !== 200) {
                                    const error = Boom.create(res.statusCode, `An error occurred getting the list of actions of the agent ${exportedAgent.agent}`);
                                    return callbackGetActionsFromAgent(error, null);
                                }
                                return callbackGetActionsFromAgent(null, res.result.actions);
                            });
                        },
                        (exportedActionsForAgent, callbackGetWebhookForEachAction) => {

                            Async.map(exportedActionsForAgent, (exportedActionForAgent, callbackGetActionWebhook) => {

                                if (!exportedActionForAgent.useWebhook){
                                    return callbackGetActionWebhook(null, exportedActionForAgent);
                                }
                                server.inject(`/action/${exportedActionForAgent.id}/webhook`, (res) => {

                                    if (res.statusCode !== 200) {
                                        if (res.statusCode === 404) {

                                            return callbackGetActionWebhook(null, exportedActionForAgent);
                                        }
                                        const error = Boom.create(res.statusCode, `An error occurred getting the webhook of action ${exportedActionForAgent.action} in domain ${exportedDomain.domain} of the agent ${exportedAgent.agent}`);
                                        return callbackGetActionWebhook(error, null);
                                    }
                                    if (!withReferences) {
                                        delete res.result.id;
                                        delete res.result.agent;
                                        delete res.result.action;
                                    }
                                    return callbackGetActionWebhook(null, Object.assign(exportedActionForAgent, { webhook: res.result }));
                                });
                            }, (err, actionsWithWebhooks) => {

                                if (err) {
                                    return callbackGetWebhookForEachAction(err);
                                }
                                return callbackGetWebhookForEachAction(null, actionsWithWebhooks);
                            });
                        },
                        (exportedActionsForAgent, callbackGetPostFormatForEachAction) => {

                            Async.map(exportedActionsForAgent, (exportedActionForAgent, callbackGetActionPostFormat) => {

                                if (!exportedActionForAgent.usePostFormat){
                                    return callbackGetActionPostFormat(null, exportedActionForAgent);
                                }
                                server.inject(`/action/${exportedActionForAgent.id}/postFormat`, (res) => {

                                    if (res.statusCode !== 200) {
                                        if (res.statusCode === 404) {
                                            return callbackGetActionPostFormat(null, exportedActionForAgent);

                                            const error = Boom.create(res.statusCode, `An error occurred getting the post format of action ${exportedActionForAgent.actionName} in domain ${exportedDomain.domainName} of the agent ${exportedAgent.agentName}`);
                                            return callbackGetActionPostFormat(error, null);
                                        }
                                    }
                                    if (!withReferences) {
                                        delete res.result.id;
                                        delete res.result.agent;
                                        delete res.result.action;
                                    }
                                    return callbackGetActionPostFormat(null, Object.assign(exportedActionForAgent, { postFormat: res.result }));
                                });
                            }, (err, actionsWithPostFormats) => {

                                if (err) {
                                    return callbackGetPostFormatForEachAction(err);
                                }
                                return callbackGetPostFormatForEachAction(null, actionsWithPostFormats);
                            });
                        }
                    ], (err, actionsWithWebhooksAndPostFormat) => {

                        if (err) {
                            return callbacGetActionsData(err);
                        }
                        if (!withReferences) {
                            actionsWithWebhooksAndPostFormat.forEach((action) => {

                                delete action.id;
                                delete action.agent;
                                if (action.slots){
                                    action.slots.forEach((slot) => {

                                        delete slot.keywordId;
                                    });
                                }
                            });
                        }
                        return callbacGetActionsData(null, Object.assign(exportedAgent, { actions: actionsWithWebhooksAndPostFormat }));
                    });
                },
                webhook: (callbackGetWebhook) => {

                    if (!exportedAgent.useWebhook){
                        return callbackGetWebhook(null, exportedAgent);
                    }
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

                    if (!exportedAgent.usePostFormat){
                        return callbackGetPostFormat(null, exportedAgent);
                    }
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
