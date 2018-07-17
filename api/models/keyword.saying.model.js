'use strict';

const Joi = require('joi');

class SayingKeywordModel {
    static get schema() {

        return {
            start: Joi.number(),
            end: Joi.number(),
            value: Joi.string().trim(),
            keyword: Joi.string().trim(),
            keywordId: Joi.number(),
            extractor: Joi.string().trim()
        };
    };
}

module.exports = SayingKeywordModel;
