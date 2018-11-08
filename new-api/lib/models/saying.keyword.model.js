import Joi from 'joi';

class SayingKeywordModel {
    static get schema() {

        return {
            start: Joi.number(),
            end: Joi.number(),
            value: Joi.string().trim(),
            keyword: Joi.string().trim(),
            keywordId: Joi.string(),
            extractor: Joi.string().trim()
        };
    };
}

module.exports = SayingKeywordModel;
