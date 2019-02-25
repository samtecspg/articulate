import Joi from 'joi';

import SayingKeywordModel from './saying.keyword.model';

class ModifierSayingModel {
    static get schema() {

        return {
            userSays: Joi.string().trim(),
            keywords: Joi.array().items(SayingKeywordModel.schema)
        };
    };
}

module.exports = ModifierSayingModel;
