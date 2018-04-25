'use strict';

const _ = require('lodash');
const Handlebars = require('handlebars');
const RegisterHandlebarHelpers = require('../../../helpers/registerHandlebarsHelpers.js');

module.exports = (conversationStateObject, responses) => {

    RegisterHandlebarHelpers(Handlebars);
    const buildedResponses = _.map(responses, (response) => {

        const numberOfTemplatedValues = response.match(/\{\{/g) ? response.match(/\{\{/g).length : 0;
        const compiledResponse = Handlebars.compile(response, { strict: true });
        try {
            return { response: compiledResponse(conversationStateObject), numOfReplacements: numberOfTemplatedValues };
        }
        catch (error) {
            return null;
        }
    });
    let parsedResponses = _.compact(buildedResponses);
    if (parsedResponses.length > 0){
        const maxNumberOfReplacements = _.max(_.map(parsedResponses, 'numOfReplacements'));
        const selectedResponses = _.filter(parsedResponses, (response) => {

            return response.response !== '' && response.numOfReplacements === maxNumberOfReplacements;
        });
        parsedResponses = selectedResponses;
    }
    return parsedResponses;
};
