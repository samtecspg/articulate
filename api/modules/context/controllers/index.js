'use strict';
const AddController = require('./add.context.controller');
const FindByIdController = require('./findById.context.controller');
const UpdateByIdController = require('./updateById.context.controller');
const DeleteByIdController = require('./deleteById.context.controller');

const ContextController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = ContextController;
