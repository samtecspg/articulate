'use strict';
const GetAvailableTool = require('./getAvailableDomains.agent.tool');
const ParseTextTool = require('./parseText.agent.tool');
const RespondTool = require('./respond.agent.tool');
const LoadAgentDataTool = require('./loadAgentData.agent.tool');
const FormatOutputDataTool = require('./formatOutputData.agent.tool');

const AgentTools = {

    getAvailableDomains: GetAvailableTool,

    parseText: ParseTextTool,

    respond: RespondTool,

    loadAgentData: LoadAgentDataTool,

    formatOutputData: FormatOutputDataTool
};

module.exports = AgentTools;
