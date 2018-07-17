'use strict';
const ValidateKeywordsTool = require('./validateKeywords.saying.tool');
const UpdateKeywordsDomainTool = require('./updateKeywordsDomain.saying.tool');

const SayingTools = {

    validateKeywordsTool: ValidateKeywordsTool,

    updateKeywordsDomainTool: UpdateKeywordsDomainTool
};

module.exports = SayingTools;
