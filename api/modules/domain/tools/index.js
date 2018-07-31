'use strict';
const RetrainModelTool = require('./retrainModel.domain.tool');
const RetrainDomainRecognizerTool = require('./retrainDomainRecognizer.domain.tool');
const GetAgentDataTool = require('./getAgentData.domain.tool');
const GetKeywordsCombinationsTool = require('./getKeywordsCombinations.domain.tool');

const DomainTools = {

    retrainModelTool: RetrainModelTool,

    retrainDomainRecognizerTool: RetrainDomainRecognizerTool,

    getAgentData: GetAgentDataTool,

    getKeywordsCombinations: GetKeywordsCombinationsTool
};

module.exports = DomainTools;
