module.exports = ({ statusCode = 400, agent, message }) => {

    const errorMessage = message ? message : `Nothing to train in agent '${agent}'. Please add sayings or keywords to your agent before starting the training process`;
    return {
        isHandled: true,
        statusCode,
        message: errorMessage 
    };
};
