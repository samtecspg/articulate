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
                    keywords: (cllbck) => {

                        server.inject(`/domain/${domain.id}/keyword`, (res) => {

                            if (res.statusCode !== 200){
                                const error = Boom.create(res.statusCode, `An error occurred getting the keywords of the domain ${domain.domainName}`);
                                return cllbck(error, null);
                            }
                            return cllbck(null, res.result);
                        });
                    },
                    sayings: (cllbck) => {

                        server.inject(`/domain/${domain.id}/saying`, (res) => {

                            if (res.statusCode !== 200){
                                const error = Boom.create(res.statusCode, `An error occurred getting the sayings of the domain ${domain.domainName}`);
                                return cllbck(error, null);
                            }
                            return cllbck(null, res.result.sayings);
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
