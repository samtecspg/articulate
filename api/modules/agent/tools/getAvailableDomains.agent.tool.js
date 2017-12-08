'use strict';
const Boom = require('boom');
const _ = require('lodash');
const Async = require('async');

module.exports = (server, redis, agentId, cb) => {

    let agentName;
    Async.waterfall([
        (callbackGetDomainsOfAgent) => {

            server.inject(`/agent/${agentId}/domain`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error ocurred getting the list of domains from agent ${agentId}`);
                    return callbackGetDomainsOfAgent(error, null);
                }
                return callbackGetDomainsOfAgent(null, res.result);
            });
        },
        (domains, callbackFormatDomains) => {

            if (domains.length === 0){
                const error = Boom.badRequest('This agent doesn\'t have domains created. To parse text first create domains please.');
                return callbackFormatDomains(error, null);
            }

            domains = _.filter(domains, (domain) => {

                return domain.lastTraining;
            });

            if (domains.length === 0){
                const error = Boom.badRequest('There doesn\'t exists trained models for the domains of this agent. Please train models for the existing domains and try again');
                return callbackFormatDomains(error, null);
            }

            agentName = domains[0].agent;
            const formattedDomains = [];
            Async.each(domains, (domain, callbackFormatDomain) => {

                const domainName = domain.domainName;
                const modelFolderName = domainName + '_' + domain.model;
                const justER = modelFolderName.indexOf('just_er') !== -1;
                if (justER){
                    server.inject(`/agent/${agentId}/domain/${domain.id}/intent`, (res) => {

                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, `An error ocurred getting the list of intents of the domain ${domain.domainName}`);
                            return callbackFormatDomain(error);
                        }
                        const formattedDomain = { name: domainName, model: modelFolderName, justER, intent: res.result[0].intentName };
                        formattedDomains.push(formattedDomain);
                        return callbackFormatDomain(null);
                    });
                }
                else {
                    const formattedDomain = { name: domainName, model: modelFolderName, justER };
                    formattedDomains.push(formattedDomain);
                    return callbackFormatDomain(null);
                }
            }, (err) => {

                if (err){
                    return callbackFormatDomains(err);
                }
                return callbackFormatDomains(null, formattedDomains);
            });
        },
        (formattedDomains, callbackDomainRecognizer) => {

            redis.exists(`agentDomainRecognizer:${agentId}`, (err, exists) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred checking if the domain recognizer exists for the agent.');
                    return cb(error);
                }
                if (exists){
                    const modelFolderName = agentName + '_domain_recognizer';
                    const formattedDomain = { name: agentName + '_domain_recognizer', model: modelFolderName };
                    formattedDomains.push(formattedDomain);
                }
                return callbackDomainRecognizer(null, formattedDomains);
            });
        }
    ], (err, result) => {

        if (err) {
            return cb(err, null);
        }
        return cb(null, result);
    });

};
