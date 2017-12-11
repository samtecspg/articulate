'use strict';
const ValidateEntitiesTool = require('./validateEntities.intent.tool');
const ValidateEntitiesScenarioTool = require('./validateEntities.scenario.tool');
const UpdateEntitiesDomainTool = require('./updateEntitiesDomain.intent.tool');

const IntentTools = {

    validateEntitiesTool: ValidateEntitiesTool,

    validateEntitiesScenarioTool: ValidateEntitiesScenarioTool,

    updateEntitiesDomainTool: UpdateEntitiesDomainTool
};

module.exports = IntentTools;
