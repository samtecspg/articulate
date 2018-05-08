'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const _ = require('lodash');
const IntentTools = require('../../intent/tools');
const DomainTools = require('../../domain/tools');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let agentId = null;
    const agent = request.payload;
    const server = request.server;
    const redis = server.app.redis;
    const rasa = server.app.rasa;
    let agentResult;
    const entitiesDir = {};

    Async.series({
        agentId: (cb) => {

            redis.incr('agentId', (err, newAgentId) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the new agent id.');
                    return cb(error);
                }
                agentId = newAgentId;
                return cb(null);
            });
        },
        addNameToList: (cb) => {

            redis.zadd('agents', 'NX', agentId, agent.agentName, (err, addResponse) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the name to the agents list.');
                    return cb(error);
                }
                if (addResponse !== 0){
                    return cb(null);
                }
                const error = Boom.badRequest('An agent with this name already exists.');
                return cb(error, null);
            });
        },
        agent: (cb) => {

            let clonedAgent = _.cloneDeep(agent);
            delete clonedAgent.entities;
            delete clonedAgent.domains;
            delete clonedAgent.webhook;
            clonedAgent = Object.assign({ id: agentId }, clonedAgent);
            const flatAgent = RemoveBlankArray(Flat(clonedAgent));
            redis.hmset('agent:' + agentId, flatAgent, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the agent data.');
                    return cb(error);
                }
                return cb(null, clonedAgent);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }
        agentResult = result.agent;
        Async.map(agent.entities, (entity, callbackAddEntities) => {

            let entityId;
            Async.waterfall([
                (cb) => {

                    redis.incr('entityId', (err, newEntityId) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred getting the new entity id.');
                            return cb(error);
                        }
                        entityId = newEntityId;
                        return cb(null);
                    });
                },
                (cb) => {

                    redis.zadd(`agentEntities:${agentId}`, 'NX', entityId, entity.entityName, (err, addResponse) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred adding the name to the entities list.');
                            return cb(error);
                        }
                        if (addResponse !== 0){
                            return cb(null);
                        }
                        const error = Boom.badRequest(`A entity with the name ${entity.entityName} already exists in the agent ${agent.agentName}.`);
                        return cb(error);
                    });
                },
                (cb) => {

                    entity = Object.assign({ id: entityId, agent: agentResult.agentName }, entity);
                    const flatEntity = RemoveBlankArray(Flat(entity));
                    redis.hmset(`entity:${entityId}`, flatEntity, (err) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred adding the entity data.');
                            return cb(error);
                        }
                        entitiesDir[entity.entityName] = entityId;
                        return cb(null, entity);
                    });
                }
            ], (errEntity, resultEntity) => {

                if (errEntity){
                    return callbackAddEntities(errEntity, null);
                }
                return callbackAddEntities(null, entity);
            });
        }, (errEntities, resultEntities) => {

            if (errEntities){
                return reply(errEntities, null);
            }
            agentResult.entities = resultEntities;
            Async.mapLimit(agent.domains, 1, (domain, callbackAddDomains) => {

                let domainId;
                let domainResult;
                Async.waterfall([
                    (cb) => {

                        redis.incr('domainId', (err, newDomainId) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred getting the new domain id.');
                                return cb(error);
                            }
                            domainId = newDomainId;
                            return cb(null);
                        });
                    },
                    (cb) => {

                        redis.zadd(`agentDomains:${agentId}`, 'NX', domainId, domain.domainName, (err, addResponse) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the name to the domains list.');
                                return cb(error);
                            }
                            if (addResponse !== 0){
                                return cb(null);
                            }
                            const error = Boom.badRequest(`A domain with the name ${domain.domainName} already exists in the agent ${agent.agentName}.`);
                            return cb(error, null);
                        });
                    },
                    (cb) => {

                        let clonedDomain = _.cloneDeep(domain);
                        delete clonedDomain.intents;
                        clonedDomain = Object.assign({ id: domainId, agent: agent.agentName }, clonedDomain);
                        const flatDomain = RemoveBlankArray(Flat(clonedDomain));
                        redis.hmset(`domain:${domainId}`, flatDomain, (err) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the domain data.');
                                return cb(error);
                            }
                            return cb(null, clonedDomain);
                        });
                    }
                ], (errDomain, resultDomain) => {

                    if (errDomain){
                        return callbackAddDomains(errDomain, null);
                    }
                    domainResult = resultDomain;
                    Async.map(domain.intents, (intent, callbackAddIntents) => {

                        let intentId;
                        Async.series({
                            entitiesCheck: (cb) => {

                                IntentTools.validateEntitiesTool(redis, agentId, intent.examples, (err) => {

                                    if (err) {
                                        return cb(err);
                                    }
                                    return cb(null);
                                });
                            },
                            intentId: (cb) => {

                                redis.incr('intentId', (err, newIntentId) => {

                                    if (err){
                                        const error = Boom.badImplementation('An error occurred getting the new intent id.');
                                        return cb(error);
                                    }
                                    intentId = newIntentId;
                                    return cb(null);
                                });
                            },
                            addToDomain: (cb) => {

                                redis.zadd(`domainIntents:${domainId}`, 'NX', intentId, intent.intentName, (err, addResponse) => {

                                    if (err){
                                        const error = Boom.badImplementation('An error occurred adding the name to the intents list.');
                                        return cb(error);
                                    }
                                    if (addResponse !== 0){
                                        return cb(null);
                                    }
                                    const error = Boom.badRequest(`A intent with the name ${intent.intentName} already exists in the domain ${domain.domainName}.`);
                                    return cb(error);
                                });
                            },
                            addToEntities: (cb) => {

                                Async.eachSeries(intent.examples, (example, nextIntent) => {

                                    Async.eachSeries(example.entities, (entity, nextEntity) => {

                                        //Only system entities have an extractor specified, so ignore sys entities
                                        if (entity.extractor){
                                            return nextEntity(null);
                                        }
                                        redis.zadd(`entityIntents:${entitiesDir[entity.entity]}`, 'NX', intentId, intent.intentName, (err, addResponse) => {

                                            if (err) {
                                                const error = Boom.badImplementation('An error occurred adding the intent to the entity list.');
                                                return nextEntity(error);
                                            }
                                            entity.entityId = entitiesDir[entity.entity];
                                            return nextEntity(null);
                                        });
                                    }, nextIntent);
                                }, cb);
                            },
                            intent: (cb) => {

                                let clonedIntent = _.cloneDeep(intent);
                                delete clonedIntent.scenario;
                                delete clonedIntent.webhook;
                                clonedIntent = Object.assign({ id: intentId, agent: agentResult.agentName, domain: domainResult.domainName }, clonedIntent);
                                clonedIntent.examples = _.map(clonedIntent.examples, (example) => {

                                    if (example.entities && example.entities.length > 0) {

                                        const entities = _.sortBy(example.entities, (entity) => {

                                            return entity.start;
                                        });
                                        example.entities = entities;
                                    }
                                    return example;
                                });
                                const flatIntent = RemoveBlankArray(Flat(clonedIntent));
                                redis.hmset(`intent:${intentId}`, flatIntent, (err) => {

                                    if (err){
                                        const error = Boom.badImplementation('An error occurred adding the intent data.');
                                        return cb(error);
                                    }
                                    return cb(null, clonedIntent);
                                });
                            }
                        }, (errAddIntent, resultAddIntent) => {

                            if (errAddIntent){
                                return callbackAddIntents(errAddIntent, null);
                            }

                            const resultIntent = resultAddIntent.intent;

                            IntentTools.updateEntitiesDomainTool(server, redis, resultIntent, agentId, domainId, null, (errUpdateEntitiesDomains) => {

                                if (errUpdateEntitiesDomains) {
                                    return callbackAddIntents(errUpdateEntitiesDomains);
                                }
                                if (intent.scenario){

                                    let scenarioId;
                                    Async.series({
                                        fathersCheck: (cb) => {

                                            IntentTools.validateEntitiesScenarioTool(redis, agentId, intent.scenario.slots, (err) => {

                                                if (err) {
                                                    return cb(err);
                                                }
                                                return cb(null);
                                            });
                                        },
                                        scenarioId: (cb) => {

                                            redis.incr('scenarioId', (err, newScenarioId) => {

                                                if (err){
                                                    const error = Boom.badImplementation('An error occurred getting the new scenario id.');
                                                    return cb(error);
                                                }
                                                scenarioId = newScenarioId;
                                                return cb(null);
                                            });
                                        },
                                        scenario: (cb) => {

                                            let scenarioToInsert = intent.scenario;
                                            scenarioToInsert = Object.assign({ id: scenarioId, agent: agentResult.agentName, domain: domainResult.domainName, intent: resultIntent.intentName }, scenarioToInsert);
                                            const flatScenario = RemoveBlankArray(Flat(scenarioToInsert));
                                            redis.hmset(`scenario:${intentId}`, flatScenario, (err) => {

                                                if (err){
                                                    const error = Boom.badImplementation('An error occurred adding the scenario data.');
                                                    return cb(error);
                                                }
                                                return cb(null, scenarioToInsert);
                                            });
                                        }
                                    }, (errScenario, resultScenario) => {

                                        if (errScenario){
                                            return callbackAddIntents(errScenario, null);
                                        }
                                        resultIntent.scenario = resultScenario.scenario;
                                        if (intent.webhook){
                                            let webhookToInsert = intent.webhook;
                                            webhookToInsert = Object.assign({ id: intentId, agent: agentResult.agentName, domain: domainResult.domainName, intent: resultIntent.intentName }, webhookToInsert);
                                            const flatWebhook = RemoveBlankArray(Flat(webhookToInsert));
                                            redis.hmset(`intentWebhook:${intentId}`, flatWebhook, (err) => {

                                                if (err){
                                                    const error = Boom.badImplementation('An error occurred adding the webhook data.');
                                                    return callbackAddIntents(error, null);
                                                }
                                                resultIntent.webhook = webhookToInsert;
                                                return callbackAddIntents(null, resultIntent);
                                            });
                                        }
                                        else {
                                            return callbackAddIntents(null, resultIntent);
                                        }
                                    });
                                }
                                else {
                                    return callbackAddIntents(null, resultIntent);
                                }
                            });
                        });
                    }, (errIntents, resultIntents) => {

                        if (errIntents){
                            return reply(errIntents, null);
                        }
                        domainResult.intents = resultIntents;

                        DomainTools.retrainModelTool(server, rasa, agent.language, agentResult.agentName, domainResult.domainName, domainResult.id, (errTraining) => {

                            if (errTraining){
                                return callbackAddDomains(errTraining);
                            }
                            return callbackAddDomains(null, domainResult);
                        });
                    });
                });
            }, (errDomains, resultDomains) => {

                if (errDomains){
                    return reply(errDomains);
                }
                agentResult.domains = resultDomains;

                DomainTools.retrainDomainRecognizerTool(server, redis, rasa, agent.language, agentResult.agentName, agentResult.id, (errTraining) => {

                    if (errTraining){
                        return reply(errTraining);
                    }
                    if (agent.useWebhook){
                        const webhook = Object.assign({ id: agentId }, agent.webhook);
                        const flatWebhook = RemoveBlankArray(Flat(webhook));
                        redis.hmset(`agentWebhook:${agentId}`, flatWebhook, (err) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the webhook data of the imported agent.');
                                return reply(error);
                            }
                            webhook.agent = agent.agentName;
                            agentResult.webhook = webhook;
                            return reply(agentResult);
                        });
                    }
                    else {
                        return reply(agentResult);
                    }
                });
            });
        });
    });
};
