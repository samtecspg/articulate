module.exports = ({ statusCode = 404, actionIds, agentId }) => {

    return {
        isHandled: true,
        statusCode,
        message: `Action(s) [${actionIds.join()}] not found for the current Agent id=[${agentId}]`
    };
};
