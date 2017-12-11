'use strict';
const RetrainModelTool = require('./retrainModel.domain.tool');
const RetrainDomainRecognizerTool = require('./retrainDomainRecognizer.domain.tool');

const DomainTools = {

    retrainModelTool: RetrainModelTool,

    retrainDomainRecognizerTool: RetrainDomainRecognizerTool
};

module.exports = DomainTools;
