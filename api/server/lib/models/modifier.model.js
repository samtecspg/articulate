import Joi from 'joi';
import ModifierSayingSchema from './modifier.saying.model';

class ModifierModel {
    static get schema() {

        return {
            modifierName: Joi.string().trim(),
            action: Joi.string().trim(),
            valueSource: Joi.string().trim(),
            staticValue: Joi.string().trim().allow(''),
            sayings: Joi.array().items(ModifierSayingSchema.schema)
        };
    };
}

module.exports = ModifierModel;
