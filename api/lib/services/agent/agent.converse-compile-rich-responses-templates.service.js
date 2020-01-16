import _ from 'lodash';

module.exports = function ({ richResponses, templateContext }) {

    const { handlebars } = this.server.app;

    if (!richResponses || richResponses.length === 0) {
        return [];
    }

    let parsedRichResponses = [];
    let currentType = '';
    try {
        parsedRichResponses = _.map(richResponses, (richResponse) => {
            currentType = richResponse.type;
            richResponse.data = JSON.parse(handlebars.compile(richResponse.data)(templateContext));
        });
    } catch (error) {
        console.error(`An error ocurred parsing ${currentType} rich response:`);
        throw error;
    }
    return parsedRichResponses;
};
