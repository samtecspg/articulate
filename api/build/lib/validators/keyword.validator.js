"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const KeywordSchema = require('../models/keyword.model').schema;

const ExampleSchema = require('../models/keyword-example.model').schema;

const ModifierSchema = require('../models/modifier.model').schema;

const ModifierSayingSchema = require('../models/modifier.saying.model').schema;

const SayingKeywordSchema = require('../models/saying.keyword.model').schema;

class KeywordValidate {
  constructor() {
    this.updateById = {
      params: (() => {
        return {
          [_constants.PARAM_KEYWORD_ID]: KeywordSchema.id.required().description('Id of the keyword')
        };
      })(),
      payload: (() => {
        return {
          keywordName: KeywordSchema.keywordName,
          uiColor: KeywordSchema.uiColor,
          regex: KeywordSchema.regex.allow('').allow(null),
          type: KeywordSchema.type.allow('').allow(null).valid(_constants.CONFIG_KEYWORD_TYPE_LEARNED, _constants.CONFIG_KEYWORD_TYPE_REGEX).optional().default(_constants.CONFIG_KEYWORD_TYPE_LEARNED).error(new Error('Please provide valid keyword type among learned and regex')),
          examples: _joi.default.array().items({
            value: ExampleSchema.value.required(),
            synonyms: ExampleSchema.synonyms.required()
          }),
          modifiers: _joi.default.array().items({
            modifierName: ModifierSchema.modifierName.required(),
            action: ModifierSchema.action.required(),
            valueSource: ModifierSchema.valueSource.required(),
            staticValue: ModifierSchema.staticValue,
            sayings: _joi.default.array().items({
              userSays: ModifierSayingSchema.userSays.required(),
              keywords: _joi.default.array().items({
                start: SayingKeywordSchema.start.required(),
                end: SayingKeywordSchema.end.required(),
                value: SayingKeywordSchema.value.required(),
                keyword: SayingKeywordSchema.keyword.required(),
                keywordId: SayingKeywordSchema.keywordId.required(),
                extractor: SayingKeywordSchema.extractor
              })
            })
          }),
          creationDate: KeywordSchema.creationDate,
          modificationDate: KeywordSchema.modificationDate
        };
      })()
    };
  }

}

const keywordValidate = new KeywordValidate();
module.exports = keywordValidate;
//# sourceMappingURL=keyword.validator.js.map