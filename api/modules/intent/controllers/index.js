'use strict';
const AddController = require('./add.intent.controller');
const FindByIdController = require('./findById.intent.controller');
const UpdateByIdController = require('./updateById.intent.controller');
const DeleteByIdController = require('./deleteById.intent.controller');
const AddScenarioController = require('./addScenario.intent.controller');
const FindScenarioController = require('./findScenario.intent.controller');
const UpdateScenarioController = require('./updateScenario.intent.controller');
const DeleteScenarioController = require('./deleteScenario.intent.controller');

const IntentController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController,

    addScenario: AddScenarioController,

    findScenario: FindScenarioController,

    updateScenario: UpdateScenarioController,

    deleteScenario: DeleteScenarioController
};

module.exports = IntentController;
