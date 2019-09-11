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
            docIds: Joi
                .array(),
            creationDate: Joi
                .string(),
            modificationDate: Joi
                .string(),
            listenFreeText: Joi
                .boolean().default(false)
        };
    };
}

module.exports = ScenarioModel;
