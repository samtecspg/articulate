import Joi from 'joi';

class ScenarioModel {
    static get schema() {

        return {
            id: Joi.number(),
            sessionId: Joi
                .string()
                .description('Session')
                .trim(),
            savedSlots: Joi
                .object(),
            actionQueue: Joi
                .array(),
            responseQueue: Joi
                .array(),
            docIds: Joi
                .array(),
            creationDate: Joi
                .string(),
            modificationDate: Joi
                .string()
        };
    };
}

module.exports = ScenarioModel;
