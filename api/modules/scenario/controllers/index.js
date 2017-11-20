'use strict';
const AddController = require('./add.scenario.controller');
const FindByIdController = require('./findById.scenario.controller');
const UpdateByIdController = require('./updateById.scenario.controller');
const DeleteByIdController = require('./deleteById.scenario.controller');

const ScenarioController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = ScenarioController;
