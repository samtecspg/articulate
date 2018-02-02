'use strict';
const AddByController = require('./addById.context.controller');
const FindByIdController = require('./findById.context.controller');
const UpdateByIdController = require('./updateById.context.controller');
const DeleteByIdController = require('./deleteById.context.controller');

const ContextController = {

    addById: AddByController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = ContextController;
