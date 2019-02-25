module.exports = ({ error, message = null }) => {

    console.error({ error, message });
    if (error.isHandled) {
        return error;
    }
    const response = { isHandled: true, statusCode: 500 };
    if (!error) {
        return response;
    }
    const errorMessage = error instanceof Error ? error.message : error;
    message = message ? message : errorMessage;
    switch (error.status) {
        case 404:
            return { ...response, message, statusCode: 404 }; //NotFound
        default:
            return { ...response, message: errorMessage }; //BadImplementation
    }
};

