import Joi from 'joi';

class ActionResponseModel {
    static get schema() {

        return {
            textResponse: Joi.string().trim(),
            actions: Joi.array().items(Joi.string().trim())
        };
    };
}

module.exports = ActionResponseModel;
