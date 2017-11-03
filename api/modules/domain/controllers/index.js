'use strict';
const AddController = require('./add.domain.controller');
const FindByIdController = require('./findById.domain.controller');
const UpdateByIdController = require('./updateById.domain.controller');
const DeleteByIdController = require('./deleteById.domain.controller');

const DomainController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = DomainController;
