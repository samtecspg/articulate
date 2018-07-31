'use strict';
const ValidateKeywordsTool = require('./validateKeywords.action.tool');
const UpdateKeywordsDomainTool = require('./updateKeywordsDomain.action.tool');

const ActionTools = {

    validateKeywordsTool: ValidateKeywordsTool,

    updateKeywordsDomainTool: UpdateKeywordsDomainTool
};

module.exports = ActionTools;
