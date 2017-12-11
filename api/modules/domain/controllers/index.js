'use strict';
const AddController = require('./add.domain.controller');
const FindByIdController = require('./findById.domain.controller');
const UpdateByIdController = require('./updateById.domain.controller');
const DeleteByIdController = require('./deleteById.domain.controller');
const FindEntitiesByDomainIdController = require('./findEntitiesByDomainId.domain.controller');
const FindIntentsByDomainIdController = require('./findIntentsByDomainId.domain.controller');
const TrainController = require('./train.domain.controller');

const DomainController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController,

    findEntitiesByDomainId: FindEntitiesByDomainIdController,

    findIntentsByDomainId: FindIntentsByDomainIdController,

    train: TrainController
};

module.exports = DomainController;
