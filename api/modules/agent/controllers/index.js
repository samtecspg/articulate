'use strict';
const AddController = require('./add.agent.controller');
const DeleteByIdController = require('./deleteById.agent.controller');
const FindAllController = require('./findAll.agent.controller');
const FindByIdController = require('./findById.agent.controller');
const FindDomainsByAgentIdController = require('./findDomainsByAgentId.agent.controller');
const FindDomainByIdByAgentIdController = require('./findDomainByIdByAgentId.agent.controller');
const FindEntitiesByAgentIdController = require('./findEntitiesByAgentId.agent.controller');
const FindEntityByIdByAgentIdController = require('./findEntityByIdByAgentId.agent.controller');
const FindIntentByIdInDomainByIdByAgentIdController = require('./findIntentByIdInDomainByIdByAgentId.agent.controller');
const FindIntentsInDomainByIdByAgentIdController = require('./findIntentsInDomainByIdByAgentId.agent.controller');
const FindIntentScenarioInDomainByIdByAgentIdController = require('./findIntentScenarioInDomainByIdByAgentId.agent.controller');
const UpdateByIdController = require('./updateById.agent.controller');
const ParseController = require('./parse.agent.controller');
const ConverseController = require('./converse.agent.controller');

const AgentController = {

    add: AddController,

    deleteById: DeleteByIdController,

    findAll: FindAllController,

    findById: FindByIdController,

    findEntitiesByAgentId: FindEntitiesByAgentIdController,

    findEntityByIdByAgentId: FindEntityByIdByAgentIdController,

    findDomainsByAgentId: FindDomainsByAgentIdController,

    findDomainByIdByAgentId: FindDomainByIdByAgentIdController,

    findIntentByIdInDomainByIdByAgentId: FindIntentByIdInDomainByIdByAgentIdController,

    findIntentsInDomainByIdByAgentId: FindIntentsInDomainByIdByAgentIdController,

    findIntentScenarioInDomainByIdByAgentId: FindIntentScenarioInDomainByIdByAgentIdController,

    updateById: UpdateByIdController,

    parse: ParseController,

    converse: ConverseController
};

module.exports = AgentController;
