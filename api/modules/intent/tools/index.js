'use strict';
const ValidateEntitiesTool = require('./validateEntities.intent.tool');
const ValidateEntitiesScenarioTool = require('./validateEntities.scenario.tool');
const UpdateEntitiesDomainTool = require('./updateEntitiesDomain.intent.tool');
const RetrainModelTool = require('./retrainModel.intent.tool');
const RetrainDomainRecognizerTool = require('./retrainDomainRecognizer.intent.tool');

const IntentTools = {

    validateEntitiesTool: ValidateEntitiesTool,

    validateEntitiesScenarioTool: ValidateEntitiesScenarioTool,

    updateEntitiesDomainTool: UpdateEntitiesDomainTool,

    retrainModelTool: RetrainModelTool,

    retrainDomainRecognizerTool: RetrainDomainRecognizerTool
};

module.exports = IntentTools;
