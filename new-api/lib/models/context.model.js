import Joi from 'joi';

class ScenarioModel {
    static get schema() {

        return {
            id: Joi.string(), // using UUID on redis
            session: Joi
                .string()
                .description('Session')
                .trim()
        };
    };
}

module.exports = ScenarioModel;
