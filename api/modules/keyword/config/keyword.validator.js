'use strict';

const KeywordSchema = require('../../../models/index').Keyword.schema;
const ExampleSchema = require('../../../models/index').Example.schema;
const Joi = require('joi');
class KeywordValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    keywordName: KeywordSchema.keywordName.required(),
                    agent: KeywordSchema.agent.required(),
                    uiColor: KeywordSchema.uiColor,
                    regex: KeywordSchema.regex.allow('').allow(null),
                    type: KeywordSchema.type.allow('').allow(null).valid('learned','regex').optional().default('learned').error(new Error('Please provide valid keyword type among learned and regex')),
                    examples: Joi.array().items({
                        value: ExampleSchema.value.required(),
                        synonyms: ExampleSchema.synonyms.required()
                    }).min(1).required()
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: KeywordSchema.id.required().description('Id of the keyword')
                };
            })()
        };

        this.findSayingsByKeywordId = {
            params: (() => {

                return {
                    id: KeywordSchema.id.required().description('Id of the keyword')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: KeywordSchema.id.required().description('Id of the keyword')
                };
            })(),
            payload: (() => {

                return {
                    keywordName: KeywordSchema.keywordName,
                    uiColor: KeywordSchema.uiColor,
                    regex: KeywordSchema.regex.allow('').allow(null),
                    type: KeywordSchema.type.allow('').allow(null).valid('learned','regex').optional().default('learned').error(new Error('Please provide valid keyword type among learned and regex')),
                    examples: Joi.array().items({
                        value: ExampleSchema.value.required(),
                        synonyms: ExampleSchema.synonyms.required()
                    })
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: KeywordSchema.id.required().description('Id of the keyword')
                };
            })()
        };

    }
}

const keywordValidate = new KeywordValidate();
module.exports = keywordValidate;
