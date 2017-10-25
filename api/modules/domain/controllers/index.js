'use strict';
const FindAllController = require('./findAll.domain.controller');
const AddController = require('./add.domain.controller');
const FindByIdController = require('./findById.domain.controller');
const UpdateByIdController = require('./updateById.domain.controller');
const DeleteByIdController = require('./deleteById.domain.controller');

const DomainController = {

    findAll: FindAllController,

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = DomainController;
