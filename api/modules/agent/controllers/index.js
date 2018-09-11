'use strict';
const AddController = require('./add.agent.controller');
const DeleteByIdController = require('./deleteById.agent.controller');
const FindAllController = require('./findAll.agent.controller');
const FindByIdController = require('./findById.agent.controller');
const FindByNameController = require('./findByName.agent.controller');
const FindDomainsByAgentIdController = require('./findDomainsByAgentId.agent.controller');
const FindDomainByIdByAgentIdController = require('./findDomainByIdByAgentId.agent.controller');
const FindKeywordsByAgentIdController = require('./findKeywordsByAgentId.agent.controller');
const FindKeywordByIdByAgentIdController = require('./findKeywordByIdByAgentId.agent.controller');
const FindActionByIdByAgentIdController = require('./findActionByIdByAgentId.agent.controller');
const FindActionsByAgentIdController = require('./findActionsByAgentId.agent.controller');
const FindSayingByIdInDomainByIdByAgentIdController = require('./findSayingByIdInDomainByIdByAgentId.agent.controller');
const FindSayingsInDomainByIdByAgentIdController = require('./findSayingsInDomainByIdByAgentId.agent.controller');
const FindActionWebhookByAgentIdController = require('./findActionWebhookByAgentId.agent.controller');
const FindActionPostFormatByAgentIdController = require('./findActionPostFormatByAgentId.agent.controller');
const UpdateByIdController = require('./updateById.agent.controller');
const ParseController = require('./parse.agent.controller');
const ConverseController = require('./converse.agent.controller');
const ExportController = require('./export.agent.controller');
const ImportController = require('./import.agent.controller');
const FindSayingsByAgentIdController = require('./findSayingsByAgentId.agent.controller');
const AddWebhookController = require('./addWebhook.agent.controller');
const AddPostFormatController = require('./addPostFormat.agent.controller');
const FindWebhookController = require('./findWebhook.agent.controller');
const FindPostFormatController = require('./findPostFormat.agent.controller');
const DeletePostFormatController = require('./deletePostFormat.agent.controller');
const UpdatePostFormatController = require('./updatePostFormat.agent.controller');
const UpdateWebhookController = require('./updateWebhook.agent.controller');
const DeleteWebhookController = require('./deleteWebhook.agent.controller');
const TrainController = require('./train.agent.controller');
const UpdateSettingsController = require('./putSettings.agent.controller');
const FindSettingsByNameController = require('./findSettingsByName.agent.controller');
const FindAllSettingsController = require('./findAllSettings.agent.controller');


const AgentController = {

    add: AddController,

    deleteById: DeleteByIdController,

    findAll: FindAllController,

    findById: FindByIdController,

    findByName: FindByNameController,

    findKeywordsByAgentId: FindKeywordsByAgentIdController,

    findKeywordByIdByAgentId: FindKeywordByIdByAgentIdController,

    findDomainsByAgentId: FindDomainsByAgentIdController,

    findDomainByIdByAgentId: FindDomainByIdByAgentIdController,

    findActionByIdByAgentId: FindActionByIdByAgentIdController,

    findActionsByAgentId: FindActionsByAgentIdController,

    findSayingByIdInDomainByIdByAgentId: FindSayingByIdInDomainByIdByAgentIdController,

    findSayingsInDomainByIdByAgentId: FindSayingsInDomainByIdByAgentIdController,

    findActionWebhookByAgentId: FindActionWebhookByAgentIdController,

    findActionPostFormatByAgentId: FindActionPostFormatByAgentIdController,

    updateById: UpdateByIdController,

    parse: ParseController,

    converse: ConverseController,

    export: ExportController,

    import: ImportController,

    findSayingsByAgentId: FindSayingsByAgentIdController,

    findActionsByAgentId: FindActionsByAgentIdController,

    addWebhook: AddWebhookController,

    addPostFormat: AddPostFormatController,

    findWebhook: FindWebhookController,

    findPostFormat : FindPostFormatController,

    deletePostFormat : DeletePostFormatController,

    updatePostFormat : UpdatePostFormatController,

    updateWebhook: UpdateWebhookController,

    deleteWebhook: DeleteWebhookController,

    train: TrainController,

    updateSettings: UpdateSettingsController,

    findSettingsByName: FindSettingsByNameController,

    findAllSettings: FindAllSettingsController
};

module.exports = AgentController;
