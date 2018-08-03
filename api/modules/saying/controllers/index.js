'use strict';
const AddController = require('./add.saying.controller');
const FindByIdController = require('./findById.saying.controller');
const UpdateByIdController = require('./updateById.saying.controller');
const DeleteByIdController = require('./deleteById.saying.controller');


const SayingController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController
};

module.exports = SayingController;
