'use strict';
const ExistsHelper = require('./exists.helper');
const BelongsHelper = require('./belongs.helper');
const DeleteChildrenHelper = require('./deleteChildren.helper');

const Helpers = {

    exists: ExistsHelper,

    belongs: BelongsHelper,

    deleteChildren: DeleteChildrenHelper
};

module.exports = Helpers;
