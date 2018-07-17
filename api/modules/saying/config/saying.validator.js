'use strict';

const Joi = require('joi');
const SayingSchema = require('../../../models/index').Saying.schema;
const SayingKeywordSchema = require('../../../models/index').SayingKeyword.schema;

class SayingValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    agent: SayingSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the saying.')),
                    domain: SayingSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the saying')),
                    userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
                    keywords: Joi.array().items({
                        keywordId: Joi.number().required().error(new Error('You must specify the id of the keyword that you are tagging in the examples')),
                        start: SayingKeywordSchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                        end: SayingKeywordSchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                        value: SayingKeywordSchema.value.required().error(new Error('The parsed value is required.')),
                        keyword: SayingKeywordSchema.keyword.required().error(new Error('The keyword reference is required.')),
                        extractor: SayingKeywordSchema.extractor
                    }).required().allow([]),
                    actions: SayingSchema.actions.allow([])
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: SayingSchema.id.required().description('Id of the saying')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: SayingSchema.id.required().description('Id of the saying')
                };
            })(),
            payload: (() => {

                return {
                    userSays: SayingSchema.userSays,
                    keywords: Joi.array().items({
                        keywordId: Joi.number(),
                        start: SayingKeywordSchema.start.required().error(new Error('The start value should be an integer and it is required for all keywords.')),
                        end: SayingKeywordSchema.end.required().error(new Error('The end value should be an integer and it is required for all keywords.')),
                        value: SayingKeywordSchema.value.required().error(new Error('The value is required for all keywords.')),
                        keyword: SayingKeywordSchema.keyword.required().error(new Error('The keyword reference is required for all keywords in examples.')),
                        extractor: SayingKeywordSchema.extractor
                    }).allow([]),
                    actions: SayingSchema.actions.allow([])
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: SayingSchema.id.required().description('Id of the saying')
                };
            })()
        };
    }
}

const sayingValidate = new SayingValidate();
module.exports = sayingValidate;
