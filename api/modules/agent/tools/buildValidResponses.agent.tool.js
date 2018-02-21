'use strict';

const _ = require('lodash');
const Handlebars = require('handlebars');

module.exports = (conversationStateObject, responses) => {

    const buildedResponses = _.map(responses, (response) => {

        const compiledResponse = Handlebars.compile(response, { strict: true });
        try {
            return compiledResponse(conversationStateObject);
        }
        catch (error) {
            return null;
        }
    });
    return _.compact(buildedResponses);
};
