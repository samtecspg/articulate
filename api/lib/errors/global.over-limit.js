module.exports = ({ statusCode = 403, level, limit, type }) => {

    return {
        isHandled: true,
        statusCode,
        message: `This instance is already using ${level} of ${limit} allowed ${type}.`
    };
};
