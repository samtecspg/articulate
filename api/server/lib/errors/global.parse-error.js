module.exports = (params) => {

    const {
        statusCode,
        message,
        ...rest
    } = params;
    return { isHandled: true, isParseError: true, statusCode, message, ...rest };
};
