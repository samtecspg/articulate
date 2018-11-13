import Joi from 'joi';
import SayingKeywordModel from './saying.keyword.model';

class SayingModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string().trim(),
            domain: Joi.string().trim(),
            userSays: Joi.string().trim(),
            keywords: Joi.array().items(SayingKeywordModel.schema),
            actions: Joi.array().items(Joi.string().trim())
        };
    };
}

module.exports = SayingModel;
