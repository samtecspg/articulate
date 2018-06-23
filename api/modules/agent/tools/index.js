'use strict';
const GetAvailableTool = require('./getAvailableDomains.agent.tool');
const ParseTextTool = require('./parseText.agent.tool');
const RespondTool = require('./respond.agent.tool');
const TrainSingleDomainTool = require('./trainSingleDomain.agent.tool');

const AgentTools = {

    getAvailableDomains: GetAvailableTool,

    parseText: ParseTextTool,

    respond: RespondTool,

    trainSingleDomain: TrainSingleDomainTool
};

module.exports = AgentTools;
