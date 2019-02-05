module.exports = ({ statusCode = 400, agent }) => {

    return {
        isHandled: true,
        statusCode,
        message: `Nothing to train in agent '${agent}'. Please make changes to your agent before starting the training process.`
    };
};
