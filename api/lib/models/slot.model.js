import Joi from 'joi';
const KeywordSchema = require('../models/keyword.model').schema;

class SlotModel {
    static get schema() {

        return {
            slotName: Joi.string().trim(),
            uiColor: Joi.string().trim(),
            keyword: Joi.string().trim(),
            keywordId: KeywordSchema.id,
            isList: Joi.boolean(),
            isRequired: Joi.boolean(),
            quickResponses: Joi.array().items(Joi.string().trim()),
            promptCountLimit: Joi.number().allow(null),
            textPrompts: Joi.array().items(Joi.string().trim()),
            remainingLife: Joi.number().allow(null),
            freeText: Joi.boolean(),
        };
    };
}

module.exports = SlotModel;
