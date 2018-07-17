'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const _ = require('lodash');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

const updateDataFunction = (redis, keywordId, currentKeyword, updateData, cb) => {

    if (updateData.examples){
        currentKeyword.examples = updateData.examples;
    }
    const flatKeyword = Flat(currentKeyword);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatKeyword[key] = flatUpdateData[key];
    });
    if (flatKeyword.regex === null){
        flatKeyword.regex = '';
    }
    redis.del(`keyword:${keywordId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporarily removing the keyword for the update.');
            return cb(error);
        }
        redis.hmset(`keyword:${keywordId}`, RemoveBlankArray(flatKeyword), (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the keyword data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatKeyword));
        });
    });
};

module.exports = (request, reply) => {

    let agentId = null;
    let oldKeywordName = null;
    let newKeywordName = null;
    const keywordId = request.params.id;
    const updateData = request.payload;
    let requiresRetrain = false;
    let requiresNameUpdate = false;

    const server = request.server;
    const redis = server.app.redis;

    if (updateData.keywordName && updateData.keywordName.startsWith('sys.')){
        const error = Boom.badRequest('\'sys.\' is a reserved prefix for system keywords. Please use another keyword name');
        return reply(error, null);
    }
    Async.waterfall([
        (cb) => {

            server.inject(`/keyword/${keywordId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified keyword doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the keyword ${keywordId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentKeyword, callback) => {

            redis.zscore('agents', currentKeyword.agent, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                    return callback(error);
                }
                if (id){
                    agentId = id;
                    return callback(null, currentKeyword);
                }
                const error = Boom.badRequest(`The agent ${currentKeyword.agent} doesn't exist`);
                return callback(error, null);
            });
        },
        (currentKeyword, cb) => {

            const requiresNameChanges = (updateData.keywordName && updateData.keywordName !== currentKeyword.keywordName);
            if (requiresNameChanges){
                oldKeywordName = currentKeyword.keywordName;
                newKeywordName = updateData.keywordName;
                requiresNameUpdate = true;
                Async.waterfall([
                    (callback) => {

                        redis.zadd(`agentKeywords:${agentId}`, 'NX', keywordId, updateData.keywordName, (err, addResponse) => {

                            if (err){
                                const error = Boom.badImplementation(`An error occurred adding the name ${updateData.keywordName} to the keywords list of the agent ${currentKeyword.agent}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            const error = Boom.badRequest(`A keyword with this name already exists in the agent ${currentKeyword.agent}.`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        redis.zrem(`agentKeywords:${agentId}`, currentKeyword.keywordName, (err, removeResult) => {

                            if (err){
                                const error = Boom.badImplementation( `An error occurred removing the name ${currentKeyword.keywordName} from the keywords list of the agent ${currentKeyword.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, keywordId, currentKeyword, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the keyword data.');
                                return callback(error);
                            }
                            return callback(null, result);
                        });
                    }
                ], (err, result) => {

                    if (err){
                        return cb(err);
                    }
                    return cb(null, result);
                });
            }
            else {
                if (updateData.examples){
                    const oldValues = _.map(currentKeyword.examples, ('value')).sort();
                    const newValues = _.map(updateData.examples, ('value')).sort();
                    if (!_.isEqual(oldValues, newValues)){
                        requiresRetrain = true;
                    }
                    else {
                        requiresRetrain = updateData.examples.some((example) => {

                            const currentExistingExample = currentKeyword.examples.find((currentExample) => {

                                return example.value === currentExample.value;
                            });
                            const isTheSame = _.isEqual(example.synonyms.sort(), currentExistingExample.synonyms.sort());
                            if (!isTheSame){
                                return true;
                            }
                            return false;
                        });
                    }
                }
                updateDataFunction(redis, keywordId, currentKeyword, updateData, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred adding the keyword data.');
                        return cb(error);
                    }
                    return cb(null, result);
                });
            }
        }
    ], (err, updatedKeyword) => {

        if (err){
            return reply(err, null);
        }

        if (requiresNameUpdate) {

            Async.waterfall([
                (callbackGetDomainsUsingKeyword) => {

                    redis.smembers(`keywordDomain:${updatedKeyword.id}`, (err, domainsUsingKeyword) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred getting the domains used by the keyword ${updatedKeyword.keywordName}`);
                            return callbackGetDomainsUsingKeyword(error);
                        }
                        if (domainsUsingKeyword && domainsUsingKeyword.length > 0){
                            return callbackGetDomainsUsingKeyword(null, domainsUsingKeyword);
                        }
                        return reply(updatedKeyword);
                    });
                },
                (domainsUsingKeyword, callbackUpdateEachDomainSayings) => {

                    Async.map(domainsUsingKeyword, (domain, callbackMapOfDomains) => {

                        Async.waterfall([
                            (callbackSetDomainOutOfDate) => {

                                redis.hmset(`domain:${domain}`, { status: Status.outOfDate }, (err) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error occurred updating the domain ${domain} status.`);
                                        return callbackSetDomainOutOfDate(error);
                                    }
                                    return callbackSetDomainOutOfDate(null);
                                });
                            },
                            (callbackGetSayingsOfDomain) => {

                                server.inject(`/domain/${domain}/saying`, (res) => {

                                    if (res.statusCode !== 200){
                                        const error = Boom.create(res.statusCode, `An error occurred getting the sayings to update of the domain ${domain}`);
                                        return callbackGetSayingsOfDomain(error, null);
                                    }
                                    return callbackGetSayingsOfDomain(null, res.result.sayings);
                                });
                            },
                            (sayings, callbackUpdateSayingsAndScenarios) => {

                                Async.map(sayings, (saying, callbackMapOfSaying) => {

                                    Async.parallel([
                                        (callbackUpdateSaying) => {

                                            let updateSaying = false;
                                            saying.examples.forEach((example) => {

                                                example.keywords.forEach((keywordInExample) => {

                                                    if (keywordInExample.keyword === oldKeywordName){
                                                        updateSaying = true;
                                                        keywordInExample.keyword = newKeywordName;
                                                    }
                                                });
                                            });
                                            if (updateSaying){
                                                redis.hmset(`saying:${saying.id}`, RemoveBlankArray(Flat(saying)), (err, result) => {

                                                    if (err){
                                                        const error = Boom.badImplementation(`An error occurred updating the saying ${saying.id} with the new values of the keyword`);
                                                        return callbackUpdateSaying(error, null);
                                                    }
                                                    return callbackUpdateSaying(null);
                                                });
                                            }
                                            else {
                                                return callbackUpdateSaying(null);
                                            }
                                        },
                                        (callbackUpdateScenario) => {

                                            Async.waterfall([
                                                (callbackGetScenario) => {

                                                    server.inject(`/saying/${saying.id}/scenario`, (res) => {

                                                        if (res.statusCode !== 200){
                                                            if (res.statusCode === 404){
                                                                return callbackGetScenario(null, null);
                                                            }
                                                            const error = Boom.create(res.statusCode, `An error occurred getting the data of the scenario ${saying.id}`);
                                                            return callbackGetScenario(error, null);
                                                        }
                                                        return callbackGetScenario(null, res.result);
                                                    });
                                                },
                                                (currentScenario, callbackUpdateScenarioSlots) => {

                                                    if (currentScenario){
                                                        let updateScenario = false;
                                                        currentScenario.slots = _.map(currentScenario.slots, (slot) => {

                                                            if (slot.keyword === oldKeywordName){
                                                                updateScenario = true;
                                                                slot.keyword = newKeywordName;
                                                            }
                                                            return slot;
                                                        });
                                                        if (updateScenario){
                                                            redis.hmset(`scenario:${saying.id}`, RemoveBlankArray(Flat(currentScenario)), (err, result) => {

                                                                if (err){
                                                                    const error = Boom.badImplementation(`An error occurred updating the scenario ${saying.id} with the new values of the keyword`);
                                                                    return callbackUpdateScenarioSlots(error, null);
                                                                }
                                                                return callbackUpdateScenarioSlots(null);
                                                            });
                                                        }
                                                        else {
                                                            return callbackUpdateScenarioSlots(null);
                                                        }
                                                    }
                                                    else {
                                                        return callbackUpdateScenarioSlots(null);
                                                    }
                                                }
                                            ], (err, result) => {

                                                if (err){
                                                    return callbackUpdateScenario(err, null);
                                                }
                                                return callbackUpdateScenario(result);
                                            });
                                        }
                                    ], (err, result) => {

                                        if (err){
                                            return callbackMapOfSaying(err);
                                        }
                                        return callbackMapOfSaying(null);
                                    });
                                }, (err, result) => {

                                    if (err){
                                        return callbackUpdateSayingsAndScenarios(err);
                                    }
                                    return callbackUpdateSayingsAndScenarios(null);
                                });
                            }
                        ], (err) => {

                            if (err){
                                return callbackMapOfDomains(err);
                            }
                            return callbackMapOfDomains(null);
                        });
                    }, (err, result) => {

                        if (err){
                            return callbackUpdateEachDomainSayings(err);
                        }
                        return callbackUpdateEachDomainSayings(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return reply(err);
                }
                redis.hmset(`agent:${agentId}`, { status: Status.outOfDate }, (err) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred updating the agent status.');
                        return reply(error);
                    }
                    server.inject(`/agent/${agentId}`, (res) => {

                        if (res.statusCode === 200){
                            server.publish(`/agent/${agentId}`, res.result);
                        }
                        return reply(Cast(updatedKeyword, 'keyword'));
                    });
                });
            });
        }
        else {
            if (!requiresRetrain){
                return reply(Cast(updatedKeyword, 'keyword'));
            }

            Async.waterfall([
                (callbackGetDomainsUsingKeyword) => {

                    redis.smembers(`keywordDomain:${updatedKeyword.id}`, (err, domainsUsingKeyword) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred getting the domains used by the keyword ${updatedKeyword.keywordName}`);
                            return callbackGetDomainsUsingKeyword(error);
                        }
                        if (domainsUsingKeyword && domainsUsingKeyword.length > 0){
                            return callbackGetDomainsUsingKeyword(null, domainsUsingKeyword);
                        }
                        return reply(updatedKeyword);
                    });
                },
                (domainsUsingKeyword, callbackUpdateEachDomainStatus) => {

                    Async.map(domainsUsingKeyword, (domain, callbackMapOfDomains) => {

                        redis.hmset(`domain:${domain}`, { status: Status.outOfDate }, (err) => {

                            if (err){
                                const error = Boom.badImplementation(`An error occurred updating the domain ${domain} status.`);
                                return callbackMapOfDomains(error);
                            }
                            return callbackMapOfDomains(null);
                        });
                    }, (err, result) => {

                        if (err){
                            return callbackUpdateEachDomainStatus(err);
                        }
                        return callbackUpdateEachDomainStatus(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return reply(err);
                }
                redis.hmset(`agent:${agentId}`, { status: Status.outOfDate }, (err) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred updating the agent status.');
                        return reply(error);
                    }
                    server.inject(`/agent/${agentId}`, (res) => {

                        if (res.statusCode === 200){
                            server.publish(`/agent/${agentId}`, res.result);
                        }
                        return reply(Cast(updatedKeyword, 'keyword'));
                    });
                });
            });
        }
    });
};
