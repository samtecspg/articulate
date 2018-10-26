import Joi from 'joi';

class ScenarioModel {
    static get schema() {

        return {
            id: Joi.string(), // using UUID on redis
            action: Joi.string().trim(),
            slots: Joi.object()
        };
    };
}

module.exports = ScenarioModel;
