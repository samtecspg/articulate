'use strict';
const Boom = require('boom');
const _ = require('lodash');
const Async = require('async');
// TODO: PATH 1.1.2
module.exports = (server, redis, agent, cb) => {

    if (!agent.enableModelsPerDomain){
        if (!agent.lastTraining){
            const error = Boom.badRequest('There doesn\'t exists trained models for this agent. Please train a model and try again.');
            return cb(error, null);
        }
        const modelFolderName = `default_${agent.model}`;
        const justER = modelFolderName.indexOf('just_er') !== -1;
        if (!justER){
            const formattedDomain = { name: 'default', model: modelFolderName, justER };
            return cb(null, [formattedDomain]);
        }
        // TODO: PATH 1.2 (2)
        //Given that the agent only have one saying and is the model is just an ER, then we need the saying name
        server.inject(`/agent/${agent.id}/export`, (res) => {

            if (res.statusCode !== 200){
                const error = Boom.create(res.statusCode, 'An error occurred getting the agent data to get the saying name');
                return cb(error);
            }
            const uniqueSayingOfAgent = res.result.domains[0].sayings[0].sayingName;
            const formattedDomain = { name: 'default', model: modelFolderName, justER, saying: uniqueSayingOfAgent };
            return cb(null, [formattedDomain]);
        });
    }
    else {
        Async.waterfall([

            (callbackGetDomainsOfAgent) => {
                // TODO: PATH 1.1.2.1
                server.inject(`/agent/${agent.id}/domain`, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the list of domains from agent ${agent.id}`);
                        return callbackGetDomainsOfAgent(error, null);
                    }
                    return callbackGetDomainsOfAgent(null, res.result.domains);
                });
            },
            (domains, callbackFormatDomains) => {
                // TODO: PATH 1.1.2.2
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

                const formattedDomains = [];
                Async.each(domains, (domain, callbackFormatDomain) => {

                    const domainName = domain.domainName;
                    const modelFolderName = domainName + '_' + domain.model;
                    const justER = modelFolderName.indexOf('just_er') !== -1;
                    if (justER){
                        // TODO: PATH 1.1.2.3
                        server.inject(`/agent/${agent.id}/domain/${domain.id}/saying`, (res) => {

                            if (res.statusCode !== 200){
                                const error = Boom.create(res.statusCode, `An error occurred getting the list of sayings of the domain ${domain.domainName}`);
                                return callbackFormatDomain(error);
                            }
                            if (res.result.sayings.length > 0){
                                const formattedDomain = { name: domainName, model: modelFolderName, justER, saying: res.result.sayings[0].sayingName };
                                formattedDomains.push(formattedDomain);
                                return callbackFormatDomain(null);
                            }
                            const error = Boom.badRequest('There doesn\'t exists trained models for the domains of this agent. Please train models for the existing domains and try again');
                            return callbackFormatDomains(error, null);
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
                // TODO: PATH 1.1.2.4
                redis.exists(`agentDomainRecognizer:${agent.id}`, (err, exists) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred checking if the domain recognizer exists for the agent.');
                        return cb(error);
                    }
                    if (exists){
                        const modelFolderName = agent.agentName + '_domain_recognizer';
                        const formattedDomain = { name: agent.agentName + '_domain_recognizer', model: modelFolderName };
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
    }

};
