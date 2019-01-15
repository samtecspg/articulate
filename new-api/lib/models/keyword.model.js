import Joi from 'joi';
import KeywordExampleModel from './keyword-example.model';
import ModifierModel from './modifier.model';

class KeywordModel {
    static get schema() {

        return {
            id: Joi.number(),
            keywordName: Joi.string().trim(),
            uiColor: Joi.string().trim(),
            examples: Joi.array().items(KeywordExampleModel.schema),
            modifiers: Joi.array().items(ModifierModel.schema),
            regex: Joi.string().trim(),
            type: Joi.string().trim(),
            creationDate: Joi
                .string(),
            modificationDate: Joi
                .string()
        };
    };
}

module.exports = KeywordModel;
