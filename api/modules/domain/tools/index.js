'use strict';
const RetrainModelTool = require('./retrainModel.domain.tool');
const RetrainDomainRecognizerTool = require('./retrainDomainRecognizer.domain.tool');
const GetAgentDataTool = require('./getAgentData.domain.tool');
const GetEntitiesCombinationsTool = require('./getEntitiesCombinations.domain.tool');

const DomainTools = {

    retrainModelTool: RetrainModelTool,

    retrainDomainRecognizerTool: RetrainDomainRecognizerTool,

    getAgentData: GetAgentDataTool,

    getEntitiesCombinations: GetEntitiesCombinationsTool
};

module.exports = DomainTools;
