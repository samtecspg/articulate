module.exports = ({ statusCode = 500, message }) => {

    return { isHandled: true, statusCode, message };
};
