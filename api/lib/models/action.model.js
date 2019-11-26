import Joi from 'joi';
import SlotModel from './slot.model';
import ActionResponseModel from './action.response.model';

class ActionModel {
    static get schema() {

        return {
            id: Joi.number(),
            actionName: Joi.string().trim(),
            slots: Joi.array().items(SlotModel.schema),
            responses: Joi.array().items(ActionResponseModel.schema),
            responsesQuickResponses: Joi.array().items(Joi.string().trim()),
            useWebhook: Joi.boolean(),
            usePostFormat: Joi.boolean(),
            creationDate: Joi.string(),
            modificationDate: Joi.date()
        };
    };
}

module.exports = ActionModel;
