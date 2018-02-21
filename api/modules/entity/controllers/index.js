'use strict';
const AddController = require('./add.entity.controller');
const FindByIdController = require('./findById.entity.controller');
const UpdateByIdController = require('./updateById.entity.controller');
const DeleteByIdController = require('./deleteById.entity.controller');
const FindIntentsByEntityIdController = require('./findIntentsByEntityId.entity.controller');

const EntityController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController,

    findIntentsByEntityId: FindIntentsByEntityIdController
};

module.exports = EntityController;
