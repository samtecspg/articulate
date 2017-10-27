'use strict';
const _ = require('lodash');


module.exports = (agentData, cb) => {

    const agent = _.map(agentData, (tmpAgent) => {

        if (tmpAgent._index === 'agent'){
            return Object.assign({ _id: tmpAgent._id }, tmpAgent._source);
        }
    })[0];
    agent.entities = _.compact(_.map(agentData, (tmpEntity) => {

        if (tmpEntity._index === 'entity'){
            return Object.assign({ _id: tmpEntity._id }, tmpEntity._source);
        }
    }));
    agent.domains = _.compact(_.map(agentData, (tempDomain) => {

        if (tempDomain._index === 'domain' && tempDomain._id.indexOf('-domain-recognizer') === -1){
            const domain = Object.assign({ _id: tempDomain._id }, tempDomain._source);
            domain.intents = _.compact(_.map(agentData, (tmpIntent) => {

                if (tmpIntent._index === 'intent' && tmpIntent._source.domain === domain._id){
                    const intent = Object.assign({ _id: tmpIntent._id }, tmpIntent._source);
                    const tempScenario = _.filter(agentData, (tmpScenario) => {

                        return tmpScenario._index === 'scenario' && tmpScenario._source.intent === intent._id;
                    })[0];
                    if (tempScenario){
                        intent.scenario = Object.assign({ _id: tempScenario._id }, tempScenario._source);
                    }
                    return intent;
                }
            }));
            return domain;
        }
    }));
    return cb(null, agent);
};
