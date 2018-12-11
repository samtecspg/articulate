import Joi from 'joi';

class ScenarioModel {
    static get schema() {

        return {
            id: Joi.number(),
            sessionId: Joi
                .string()
                .description('Session')
                .trim(),
            actionQueue: Joi
                .array(),
            responseQueue: Joi
                .array()
        };
    };
}

module.exports = ScenarioModel;
