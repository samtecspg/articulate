'use strict';
const AddController = require('./add.domain.controller');
const FindByIdController = require('./findById.domain.controller');
const UpdateByIdController = require('./updateById.domain.controller');
const DeleteByIdController = require('./deleteById.domain.controller');
const FindKeywordsByDomainIdController = require('./findKeywordsByDomainId.domain.controller');
const FindSayingsByDomainIdController = require('./findSayingsByDomainId.domain.controller');
const TrainController = require('./train.domain.controller');

const DomainController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController,

    findKeywordsByDomainId: FindKeywordsByDomainIdController,

    findSayingsByDomainId: FindSayingsByDomainIdController,

    train: TrainController
};

module.exports = DomainController;
