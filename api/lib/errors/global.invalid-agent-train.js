module.exports = ({ statusCode = 400, agent, message }) => {

    const errorMessage = message ? message : `Nothing to train in agent '${agent}'. Please make changes to your agent before starting the training process.`;
    return {
        isHandled: true,
        statusCode,
        message: errorMessage 
    };
};
