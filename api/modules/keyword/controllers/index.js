'use strict';
const AddController = require('./add.keyword.controller');
const FindByIdController = require('./findById.keyword.controller');
const UpdateByIdController = require('./updateById.keyword.controller');
const DeleteByIdController = require('./deleteById.keyword.controller');
const FindSayingsByKeywordIdController = require('./findSayingsByKeywordId.keyword.controller');

const KeywordController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController,

    findSayingsByKeywordId: FindSayingsByKeywordIdController
};

module.exports = KeywordController;
