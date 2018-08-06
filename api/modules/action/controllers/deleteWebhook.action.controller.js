'use strict';

module.exports = (request, reply) => {

    /*
    * If the operation encounters an error during the
    * "action.delete-webhook-by-action-id.graph" execution
    * then the error will be captured there and this controller
    * will not be executed. So if it got here is because it was successful
    * */
    return reply({ message: 'successful operation' }).code(200);
};
