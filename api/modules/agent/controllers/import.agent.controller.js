'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const _ = require('lodash');
const SayingTools = require('../../saying/tools');
const ActionTools = require('../../action/tools');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    let agentId = null;
    const agent = request.payload;
    const server = request.server;
    const redis = server.app.redis;
    let agentResult;
    const keywordsDir = {};

    Async.series({
        agentId: (cb) => {

            redis.incr('agentId', (err, newAgentId) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting the new agent id.');
                    return cb(error);
                }
                agentId = newAgentId;
                return cb(null);
            });
        },
        addNameToList: (cb) => {

            redis.zadd('agents', 'NX', agentId, agent.agentName, (err, addResponse) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the name to the agents list.');
                    return cb(error);
                }
                if (addResponse !== 0) {
                    return cb(null);
                }
                const error = Boom.badRequest('An agent with this name already exists.');
                return cb(error, null);
            });
        },
        agent: (cb) => {

            let clonedAgent = _.cloneDeep(agent);
            delete clonedAgent.keywords;
            delete clonedAgent.domains;
            delete clonedAgent.actions;
            delete clonedAgent.webhook;
            delete clonedAgent.postFormat;
            delete clonedAgent.settings;
            clonedAgent = Object.assign({ id: agentId }, clonedAgent);
            clonedAgent.status = Status.outOfDate;
            clonedAgent.enableModelsPerDomain = clonedAgent.enableModelsPerDomain !== undefined ? clonedAgent.enableModelsPerDomain : true;
            clonedAgent.multiDomain = clonedAgent.multiDomain !== undefined ? clonedAgent.multiDomain : true;
            clonedAgent.extraTrainingData = clonedAgent.extraTrainingData !== undefined ? clonedAgent.extraTrainingData : true;
            const flatAgent = RemoveBlankArray(Flat(clonedAgent));
            redis.hmset('agent:' + agentId, flatAgent, (err) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the agent data.');
                    return cb(error);
                }
                return cb(null, clonedAgent);
            });
        },
        actions: (cbAddActionsToAgent) => {

            Async.map(agent.actions, (action, callbackAddActions) => {

                let actionId;
                Async.series({
                    keywordsCheck: (cb) => {

                        ActionTools.validateKeywordsTool(redis, agentId, action.examples, (err) => {

                            if (err) {
                                return cb(err);
                            }
                            return cb(null);
                        });
                    },
                    actionId: (cb) => {

                        redis.incr('actionId', (err, newActionId) => {

                            if (err) {
                                const error = Boom.badImplementation('An error occurred getting the new action id.');
                                return cb(error);
                            }
                            actionId = newActionId;
                            return cb(null);
                        });
                    },
                    addToDomain: (cb) => {

                        redis.zadd(`agentActions:${agentId}`, 'NX', actionId, action.actionName, (err, addResponse) => {

                            if (err) {
                                const error = Boom.badImplementation('An error occurred adding the name to the actions list.');
                                return cb(error);
                            }
                            if (addResponse !== 0) {
                                return cb(null);
                            }
                            const error = Boom.badRequest(`A action with the name ${action.actionName} already exists in the domain ${domain.domainName}.`);
                            return cb(error);
                        });
                    },
                    addToKeywords: (cb) => {

                        Async.eachSeries(action.slots, (slot, nextSlot) => {

                            //Only system keywords have an extractor specified, so ignore sys keywords
                            if (slot.keyword.indexOf('sys.') > -1){
                                return nextSlot(null);
                            }
                            redis.zadd(`keywordActions:${slot.keywordId}`, 'NX', actionId, action.actionName, (err) => {

                                if (err) {
                                    const error = Boom.badImplementation('An error occurred adding the action to the keyword list.');
                                    return nextSlot(error);
                                }
                                return nextSlot(null);
                            });
                        }, cb);
                    },
                    action: (cb) => {

                        let clonedAction = _.cloneDeep(action);
                        delete clonedAction.webhook;
                        delete clonedAction.postFormat;
                        clonedAction = Object.assign({ id: actionId, agent: agent.agentName }, clonedAction);
                        const flatAction = RemoveBlankArray(Flat(clonedAction));
                        redis.hmset(`action:${actionId}`, flatAction, (err) => {

                            if (err) {
                                const error = Boom.badImplementation('An error occurred adding the action data.');
                                return cb(error);
                            }
                            return cb(null, clonedAction);
                        });
                    }
                }, (errAddAction, resultAddAction) => {

                    if (errAddAction) {
                        return callbackAddActions(errAddAction, null);
                    }

                    const resultAction = resultAddAction.action;

                    Async.parallel([
                        (callbackAddWebhookToAction) => {

                            if (action.webhook) {
                                let webhookToInsert = action.webhook;
                                webhookToInsert = Object.assign({ id: actionId, agent: agent.agentName, action: resultAction.actionName }, webhookToInsert);
                                const flatWebhook = RemoveBlankArray(Flat(webhookToInsert));
                                redis.hmset(`actionWebhook:${actionId}`, flatWebhook, (err) => {

                                    if (err) {
                                        const error = Boom.badImplementation('An error occurred adding the webhook data.');
                                        return callbackAddWebhookToAction(error, null);
                                    }
                                    resultAction.webhook = webhookToInsert;
                                    return callbackAddWebhookToAction(null);
                                });
                            }
                            else {
                                return callbackAddWebhookToAction(null);
                            }
                        },
                        (callbackAddPostFormatToAction) => {

                            if (action.postFormat) {
                                let postFormatToInsert = action.postFormat;
                                postFormatToInsert = Object.assign({ id: actionId, agent: agent.agentName, action: resultAction.actionName }, postFormatToInsert);
                                const flatPostFormat = RemoveBlankArray(Flat(postFormatToInsert));
                                redis.hmset(`actionPostFormat:${actionId}`, flatPostFormat, (err) => {

                                    if (err) {
                                        const error = Boom.badImplementation('An error occurred adding the post format data.');
                                        return callbackAddPostFormatToAction(error, null);
                                    }
                                    resultAction.postFormat = postFormatToInsert;
                                    return callbackAddPostFormatToAction(null);
                                });
                            }
                            else {
                                return callbackAddPostFormatToAction(null);
                            }
                        }
                    ], (err) => {

                        if (err){
                            callbackAddActions(err);
                        }
                        callbackAddActions(null, resultAction);
                    });
                });
            }, (errActions, resultActions) => {

                if (errActions) {
                    return cbAddActionsToAgent(errActions, null);
                }
                return cbAddActionsToAgent(null, resultActions);
            });
        }
    }, (err, result) => {

        if (err) {
            return reply(err, null);
        }
        agentResult = result.agent;
        agentResult.actions = result.actions;
        Async.map(agent.keywords, (keyword, callbackAddKeywords) => {

            let keywordId;
            Async.waterfall([
                (cb) => {

                    redis.incr('keywordId', (err, newKeywordId) => {

                        if (err) {
                            const error = Boom.badImplementation('An error occurred getting the new keyword id.');
                            return cb(error);
                        }
                        keywordId = newKeywordId;
                        return cb(null);
                    });
                },
                (cb) => {

                    redis.zadd(`agentKeywords:${agentId}`, 'NX', keywordId, keyword.keywordName, (err, addResponse) => {

                        if (err) {
                            const error = Boom.badImplementation('An error occurred adding the name to the keywords list.');
                            return cb(error);
                        }
                        if (addResponse !== 0) {
                            return cb(null);
                        }
                        const error = Boom.badRequest(`A keyword with the name ${keyword.keywordName} already exists in the agent ${agent.agentName}.`);
                        return cb(error);
                    });
                },
                (cb) => {

                    keyword = Object.assign({ id: keywordId, agent: agentResult.agentName }, keyword);
                    keyword.regex = !keyword.regex ? '' : keyword.regex;
                    const flatKeyword = RemoveBlankArray(Flat(keyword));
                    redis.hmset(`keyword:${keywordId}`, flatKeyword, (err) => {

                        if (err) {
                            const error = Boom.badImplementation('An error occurred adding the keyword data.');
                            return cb(error);
                        }
                        keywordsDir[keyword.keywordName] = keywordId;
                        return cb(null, keyword);
                    });
                }
            ], (errKeyword) => {

                if (errKeyword) {
                    return callbackAddKeywords(errKeyword, null);
                }
                return callbackAddKeywords(null, keyword);
            });
        }, (errKeywords, resultKeywords) => {

            if (errKeywords) {
                return reply(errKeywords, null);
            }
            agentResult.keywords = resultKeywords;
            Async.mapLimit(agent.domains, 1, (domain, callbackAddDomains) => {

                let domainId;
                let domainResult;
                Async.waterfall([
                    (cb) => {

                        redis.incr('domainId', (err, newDomainId) => {

                            if (err) {
                                const error = Boom.badImplementation('An error occurred getting the new domain id.');
                                return cb(error);
                            }
                            domainId = newDomainId;
                            return cb(null);
                        });
                    },
                    (cb) => {

                        redis.zadd(`agentDomains:${agentId}`, 'NX', domainId, domain.domainName, (err, addResponse) => {

                            if (err) {
                                const error = Boom.badImplementation('An error occurred adding the name to the domains list.');
                                return cb(error);
                            }
                            if (addResponse !== 0) {
                                return cb(null);
                            }
                            const error = Boom.badRequest(`A domain with the name ${domain.domainName} already exists in the agent ${agent.agentName}.`);
                            return cb(error, null);
                        });
                    },
                    (cb) => {

                        let clonedDomain = _.cloneDeep(domain);
                        clonedDomain.status = Status.outOfDate;
                        delete clonedDomain.sayings;
                        delete clonedDomain.model; //This would make that the training process don't try to unload a non existent model
                        delete clonedDomain.lastTraining;
                        clonedDomain = Object.assign({ id: domainId, agent: agent.agentName }, clonedDomain);
                        const flatDomain = RemoveBlankArray(Flat(clonedDomain));
                        redis.hmset(`domain:${domainId}`, flatDomain, (err) => {

                            if (err) {
                                const error = Boom.badImplementation('An error occurred adding the domain data.');
                                return cb(error);
                            }
                            return cb(null, clonedDomain);
                        });
                    }
                ], (errDomain, resultDomain) => {

                    if (errDomain) {
                        return callbackAddDomains(errDomain, null);
                    }
                    domainResult = resultDomain;
                    Async.parallel({
                        sayings: (cbAddSayingsToDomain) => {

                            Async.map(domain.sayings, (saying, callbackAddSayings) => {

                                let sayingId;
                                Async.series({
                                    keywordsCheck: (cb) => {

                                        SayingTools.validateKeywordsTool(redis, agentId, saying.examples, (err) => {

                                            if (err) {
                                                return cb(err);
                                            }
                                            return cb(null);
                                        });
                                    },
                                    sayingId: (cb) => {

                                        redis.incr('sayingId', (err, newSayingId) => {

                                            if (err) {
                                                const error = Boom.badImplementation('An error occurred getting the new saying id.');
                                                return cb(error);
                                            }
                                            sayingId = newSayingId;
                                            return cb(null);
                                        });
                                    },
                                    addToDomain: (cb) => {

                                        redis.zadd(`domainSayings:${domainId}`, 'NX', sayingId, sayingId, (err, addResponse) => {

                                            if (err) {
                                                const error = Boom.badImplementation('An error occurred adding the name to the sayings list.');
                                                return cb(error);
                                            }
                                            if (addResponse !== 0) {
                                                return cb(null);
                                            }
                                            const error = Boom.badRequest(`A saying with the name ${saying.sayingName} already exists in the domain ${domain.domainName}.`);
                                            return cb(error);
                                        });
                                    },
                                    addToKeywords: (cb) => {

                                        Async.eachSeries(saying.keywords, (keyword, nextKeyword) => {

                                            //Only system keywords have an extractor specified, so ignore sys keywords
                                            if (keyword.extractor) {
                                                return nextKeyword(null);
                                            }
                                            redis.zadd(`keywordSayings:${keywordsDir[keyword.keyword]}`, 'NX', sayingId, sayingId, (err) => {

                                                if (err) {
                                                    const error = Boom.badImplementation('An error occurred adding the saying to the keyword list.');
                                                    return nextKeyword(error);
                                                }
                                                keyword.keywordId = keywordsDir[keyword.keyword];
                                                return nextKeyword(null);
                                            });
                                        }, cb);
                                    },
                                    saying: (cb) => {

                                        let clonedSaying = _.cloneDeep(saying);
                                        clonedSaying = Object.assign({ id: sayingId, agent: agentResult.agentName, domain: domainResult.domainName }, clonedSaying);
                                        clonedSaying.keywords = _.sortBy(clonedSaying.keywords, (keyword) => {

                                            return keyword.start;
                                        });
                                        const flatSaying = RemoveBlankArray(Flat(clonedSaying));
                                        redis.hmset(`saying:${sayingId}`, flatSaying, (err) => {

                                            if (err) {
                                                const error = Boom.badImplementation('An error occurred adding the saying data.');
                                                return cb(error);
                                            }
                                            return cb(null, clonedSaying);
                                        });
                                    }
                                }, (errAddSaying, resultAddSaying) => {

                                    if (errAddSaying) {
                                        return callbackAddSayings(errAddSaying, null);
                                    }

                                    const resultSaying = resultAddSaying.saying;

                                    SayingTools.updateKeywordsDomainTool(server, redis, resultSaying, agentId, domainId, null, (errUpdateKeywordsDomains) => {

                                        if (errUpdateKeywordsDomains) {
                                            return callbackAddSayings(errUpdateKeywordsDomains);
                                        }
                                        return callbackAddSayings(null, resultSaying);
                                    });
                                });
                            }, (errSayings, resultSayings) => {

                                if (errSayings) {
                                    return cbAddSayingsToDomain(errSayings, null);
                                }
                                return cbAddSayingsToDomain(null, resultSayings);
                            });
                        },
                    }, (errAddActionAndSayings, sayingsAndActions) => {

                        if (errAddActionAndSayings){
                            return callbackAddDomains(errAddActionAndSayings, null);
                        }
                        return callbackAddDomains(null, Object.assign(domainResult, sayingsAndActions));
                    });
                });
            }, (errDomains, resultDomains) => {

                if (errDomains) {
                    return reply(errDomains);
                }
                agentResult.domains = resultDomains;

                Async.parallel({

                    addedPostFormat: (callbacksetAgentPostFormat) => {

                        if (agent.usePostFormat) {
                            const postFormat = Object.assign({ id: agentId }, agent.postFormat);
                            const flatPostFormat = RemoveBlankArray(Flat(postFormat));
                            redis.hmset(`agentPostFormat:${agentId}`, flatPostFormat, (err) => {

                                if (err) {
                                    const error = Boom.badImplementation('An error occurred adding the webhook data of the imported agent.');
                                    return callbacksetAgentPostFormat(error, null);
                                }
                                postFormat.agent = agent.agentName;
                                return callbacksetAgentPostFormat(null, postFormat);
                            });

                        }
                        else {
                            return callbacksetAgentPostFormat(null);
                        }
                    },
                    addedWebhook: (callBackAgentWebhook) => {

                        if (agent.useWebhook) {
                            const webhook = Object.assign({ id: agentId }, agent.webhook);
                            const flatWebhook = RemoveBlankArray(Flat(webhook));
                            redis.hmset(`agentWebhook:${agentId}`, flatWebhook, (err) => {

                                if (err) {
                                    const error = Boom.badImplementation('An error occurred adding the webhook data of the imported agent.');
                                    return callBackAgentWebhook(error, null);
                                }
                                webhook.agent = agent.agentName;
                                return callBackAgentWebhook(null, webhook);
                            });

                        }
                        else {
                            return callBackAgentWebhook(null);
                        }
                    },
                    addedSettings: (callBackAgentSettings) => {

                        server.inject({
                            method: 'PUT',
                            url: `/agent/${agentId}/settings`,
                            payload: agent.settings
                        }, (res) => {

                            if (res.statusCode !== 200) {
                                const error = Boom.create(res.statusCode, 'An error occurred adding the settings of the agent');
                                return callBackAgentSettings(error, null);
                            }
                            return callBackAgentSettings(null, res.result);
                        });
                    }
                }, (err, resultWebhookPostFormatCall) => {

                    if (err) {
                        return reply(err);
                    }

                    if (agent.usePostFormat) {
                        agentResult.postFormat = resultWebhookPostFormatCall.addedPostFormat;
                    }
                    if (agent.useWebhook) {
                        agentResult.webhook = resultWebhookPostFormatCall.addedWebhook;
                    }
                    agentResult.settings = resultWebhookPostFormatCall.addedSettings;
                    return reply(agentResult);

                });
            });
        });
    });
};
