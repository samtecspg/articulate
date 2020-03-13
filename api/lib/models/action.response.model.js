import Joi from 'joi';
import ActionResponseRichResponseModel from './action.response.rich-response.model';


class ActionResponseModel {
    static get schema() {

        return {
            richResponses: Joi.array().items(ActionResponseRichResponseModel.schema),
            textResponse: Joi.string().trim(),
            actions: Joi.array().items(Joi.string().trim()),
            disableTextResponse: Joi.boolean().default(false)
        };
    };
}

module.exports = ActionResponseModel;
