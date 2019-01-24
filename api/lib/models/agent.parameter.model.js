import Joi from 'joi';

class AgentParameterModel {
    static get schema() {

        return {
            name: Joi.string().trim(),
            value: Joi.string().trim()
        };
    };
}

module.exports = AgentParameterModel;
