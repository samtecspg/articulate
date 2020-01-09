import Joi from 'joi';

class ActionResponseRichResponseModel {
    static get schema() {

        return {
            type: Joi.string().trim(),
            data: Joi.any()
        };
    };
}

module.exports = ActionResponseRichResponseModel;
