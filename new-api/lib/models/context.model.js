import Joi from 'joi';

class ScenarioModel {
    static get schema() {

        return {
            id: Joi.number(),
            session: Joi
                .string()
                .description('Session')
                .trim()
        };
    };
}

module.exports = ScenarioModel;
