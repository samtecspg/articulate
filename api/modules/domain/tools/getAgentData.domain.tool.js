'use strict';
const Async = require('async');
const Boom = require('boom');

const getAgentData = (server, agentId, cb) => {

    Async.waterfall([
        (callback) => {

            server.inject(`/agent/${agentId}/domain`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error occurred getting the domainst of the agent ${agentId}`);
                    return callback(error, null);
                }
                return callback(null, res.result.domains);
            });
        },
        (domains, callback) => {

            Async.map(domains, (domain, cllback) => {

                Async.parallel({
                    entities: (cllbck) => {

                        server.inject(`/domain/${domain.id}/entity`, (res) => {

                            if (res.statusCode !== 200){
                                const error = Boom.create(res.statusCode, `An error occurred getting the entities of the domain ${domain.domainName}`);
                                return cllbck(error, null);
                            }
                            return cllbck(null, res.result);
                        });
                    },
                    intents: (cllbck) => {

                        server.inject(`/domain/${domain.id}/intent`, (res) => {

                            if (res.statusCode !== 200){
                                const error = Boom.create(res.statusCode, `An error occurred getting the intents of the domain ${domain.domainName}`);
                                return cllbck(error, null);
                            }
                            return cllbck(null, res.result.intents);
                        });
                    }

                }, (err, result) => {

                    if (err){
                        return cllback(err);
                    }
                    Object.assign(result, { domainId: domain.id, domainName: domain.domainName });
                    return cllback(null, result);
                });

            }, (err, result) => {

                if (err){
                    return callback(err, null);
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

};

module.exports = getAgentData;
