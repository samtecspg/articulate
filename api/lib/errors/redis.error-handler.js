import * as Constants from '../../util/constants';

module.exports = ({ error, message = null }) => {

    console.error({ error, message });
    if (error.isHandled || error.isBoom) {
        return error;
    }
    const response = { isHandled: true, statusCode: 500 };
    if (!error) {
        return response;
    }
    const errorMessage = error instanceof Error ? error.message : error;
    message = message ? message : errorMessage;
    switch (errorMessage) {
        case Constants.ERROR_NOT_FOUND:
            return { ...response, message, statusCode: 404 }; //NotFound
        case Constants.ERROR_VALIDATION:
            return { ...response, message: JSON.stringify(error.errors), statusCode: 400 };
        case Constants.ERROR_FIELD_NOT_FOUND:
            return { ...response, message: Constants.ERROR_FIELD_NOT_FOUND, statusCode: 400 }; //Bad Request
        default:
            return { ...response, message: errorMessage }; //BadImplementation
    }
};

