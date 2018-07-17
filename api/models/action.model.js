'use strict';

const Joi = require('joi');
const SlotModel = require('./slot.action.model');
class ActionModel {
    static get schema() {

        return {
            id: Joi.string().trim(),
            agent: Joi.string().trim(),
            actionName: Joi.string().trim(),
            slots: Joi.array().items(SlotModel.schema),
            responses: Joi.array().items(Joi.string().trim()),
            useWebhook: Joi.boolean(),
            usePostFormat: Joi.boolean()
        };
    };
}

module.exports = ActionModel;
