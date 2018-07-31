'use strict';
const AddController = require('./add.action.controller');
const FindByIdController = require('./findById.action.controller');
const UpdateByIdController = require('./updateById.action.controller');
const DeleteByIdController = require('./deleteById.action.controller');
const AddWebhookController = require('./addWebhook.action.controller');
const FindWebhookController = require('./findWebhook.action.controller');
const UpdateWebhookController = require('./updateWebhook.action.controller');
const DeleteWebhookController = require('./deleteWebhook.action.controller');

const AddPostFormatController  = require('./addPostFormat.action.controller');
const FindPostFormatController = require('./findPostFormat.action.controller');
const UpdatePostFormatController = require('./updatePostFormat.action.controller');
const DeletePostFormatController = require('./deletePostFormat.action.controller');


const ActionController = {

    add: AddController,

    findById: FindByIdController,

    updateById: UpdateByIdController,

    deleteById: DeleteByIdController,

    addWebhook: AddWebhookController,

    findWebhook: FindWebhookController,

    updateWebhook: UpdateWebhookController,

    deleteWebhook: DeleteWebhookController,

    addPostFormat: AddPostFormatController,

    findPostFormat: FindPostFormatController,

    updatePostFormat: UpdatePostFormatController,

    deletePostFormat: DeletePostFormatController
};

module.exports = ActionController;
