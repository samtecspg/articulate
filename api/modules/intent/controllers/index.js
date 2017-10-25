'use strict';
const FindAllController = require('./findAll.intent.controller');
const AddController = require('./add.intent.controller');
const FindByIdController = require('./findById.intent.controller');
const UpdateByIdController = require('./updateById.intent.controller');
const DeleteByIdController = require('./deleteById.intent.controller');

const IntentController = {

    findAll: FindAllController,

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = IntentController;
