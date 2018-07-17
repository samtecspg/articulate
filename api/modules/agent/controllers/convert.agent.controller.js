'use strict';
const Boom = require('boom');
const _ = require('lodash');
const RandomMC = require('random-material-color');

module.exports = (request, reply) => {

    try {
        const agent = request.payload;
        const newData = _.cloneDeep(agent);

        newData.multiDomain = true;
        delete newData.entities;
        delete newData.domains;
        delete newData.lastTraining;
        delete newData.status;

        newData.settings.sayingClassifierPipeline = newData.settings.intentClassifierPipeline;
        newData.settings.keywordClassifierPipeline = newData.settings.entityClassifierPipeline;

        delete newData.settings.intentClassifierPipeline;
        delete newData.settings.entityClassifierPipeline;

        newData.actions = [];
        newData.keywords = [];
        newData.domains = [];

        const entityColorDir = {};

        agent.entities.forEach((entity) => {

            const newKeyword = entity;
            newKeyword.keywordName = entity.entityName;
            delete newKeyword.entityName;
            newData.keywords.push(newKeyword);
            entityColorDir[newKeyword.keywordName] = newKeyword.uiColor;
        });

        agent.domains.forEach((domain) => {

            const newDomain = _.cloneDeep(domain);
            newDomain.actionThreshold = newDomain.intentThreshold;
            delete newDomain.intentThreshold;
            delete newDomain.status;
            delete newDomain.lastTraining;
            delete newDomain.model;
            delete newDomain.intents;
            newDomain.sayings = [];

            domain.intents.forEach((intent) => {

                const newAction = _.cloneDeep(intent);
                newAction.actionName = intent.intentName;
                delete newAction.intentName;
                newAction.slots = intent.scenario.slots;

                newAction.slots.forEach((slot) => {

                    slot.keyword = slot.entity;
                    slot.uiColor = entityColorDir[slot.keyword];
                    if (!slot.uiColor){
                        slot.uiColor = RandomMC.getColor();
                    }
                    delete slot.entity;
                });

                newAction.responses = intent.scenario.intentResponses;
                delete newAction.scenario;
                delete newAction.examples;
                newData.actions.push(newAction);

                intent.examples.forEach((example) => {

                    const newSaying = _.cloneDeep(example);
                    newSaying.keywords = example.entities;
                    newSaying.keywords.forEach((keyword) => {

                        keyword.keyword = keyword.entity;
                        delete keyword.entity;
                    });
                    delete newSaying.entities;
                    newSaying.actions = [];
                    newSaying.actions.push(intent.intentName);
                    newDomain.sayings.push(newSaying);
                });
            });

            newData.domains.push(newDomain);
        });

        return reply(newData);
    } catch (error) {

        const err = Boom.badImplementation('An error ocurred converting the payload');
        return reply(err, null);
    }
};
