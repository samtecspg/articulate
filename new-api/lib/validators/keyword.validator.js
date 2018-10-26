import Joi from 'joi';
import {
    CONFIG_KEYWORD_TYPE_LEARNED,
    CONFIG_KEYWORD_TYPE_REGEX,
    PARAM_KEYWORD_ID
} from '../../util/constants';

const KeywordSchema = require('../models/keyword.model').schema;
const ExampleSchema = require('../models/keyword-example.model').schema;

class KeywordValidate {
    constructor() {



        this.updateById = {
            params: (() => {

                return {
                    [PARAM_KEYWORD_ID]: KeywordSchema.id.required().description('Id of the keyword')
                };
            })(),
            payload: (() => {

                return {
                    keywordName: KeywordSchema.keywordName,
                    uiColor: KeywordSchema.uiColor,
                    regex: KeywordSchema.regex.allow('').allow(null),
                    type: KeywordSchema.type
                        .allow('')
                        .allow(null)
                        .valid(CONFIG_KEYWORD_TYPE_LEARNED, CONFIG_KEYWORD_TYPE_REGEX)
                        .optional()
                        .default(CONFIG_KEYWORD_TYPE_LEARNED)
                        .error(new Error('Please provide valid keyword type among learned and regex')),
                    examples: Joi.array().items({
                        value: ExampleSchema.value.required(),
                        synonyms: ExampleSchema.synonyms.required()
                    })
                };
            })()
        };

    }
}

const keywordValidate = new KeywordValidate();
module.exports = keywordValidate;
