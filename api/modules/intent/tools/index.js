'use strict';
const ValidateEntityTool = require('./validateEntity.intent.tool');
const UpdateEntitiesTool = require('./updateEntities.intent.tool');
const RetrainModelTool = require('./retrainModel.intent.tool');
const RetrainDomainRecognizerTool = require('./retrainDomainRecognizer.intent.tool');

const EntityController = {

    validateEntityTool: ValidateEntityTool,

    updateEntitiesTool: UpdateEntitiesTool,

    retrainModelTool: RetrainModelTool,

    retrainDomainRecognizerTool: RetrainDomainRecognizerTool
};

module.exports = EntityController;
