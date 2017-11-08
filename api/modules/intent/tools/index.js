'use strict';
const ValidateEntitiesTool = require('./validateEntities.intent.tool');
const UpdateEntitiesDomainTool = require('./updateEntitiesDomain.intent.tool');
const RetrainModelTool = require('./retrainModel.intent.tool');
const RetrainDomainRecognizerTool = require('./retrainDomainRecognizer.intent.tool');

const EntityController = {

    validateEntitiesTool: ValidateEntitiesTool,

    updateEntitiesDomainTool: UpdateEntitiesDomainTool,

    retrainModelTool: RetrainModelTool,

    retrainDomainRecognizerTool: RetrainDomainRecognizerTool
};

module.exports = EntityController;
