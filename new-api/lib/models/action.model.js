import Joi from 'joi';
import SlotModel from './slot.model';

class ActionModel {
    static get schema() {

        return {
            id: Joi.string(), // using UUID on redis
            actionName: Joi.string().trim(),
            slots: Joi.array().items(SlotModel.schema),
            responses: Joi.array().items(Joi.string().trim()),
            useWebhook: Joi.boolean(),
            usePostFormat: Joi.boolean()
        };
    };
}

module.exports = ActionModel;
