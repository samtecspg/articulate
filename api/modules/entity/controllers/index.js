'use strict';
const FindAllController = require('./findAll.entity.controller');
const AddController = require('./add.entity.controller');
const FindByIdController = require('./findById.entity.controller');
const UpdateByIdController = require('./updateById.entity.controller');
const DeleteByIdController = require('./deleteById.entity.controller');

const EntityController = {

    findAll: FindAllController,

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = EntityController;
