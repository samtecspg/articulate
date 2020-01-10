import _ from 'lodash';

module.exports = function ({ richResponses, templateContext }) {

    const { handlebars } = this.server.app;

    if (!richResponses || richResponses.length === 0) {
        return [];
    }

    let parsedRichResponses = _.map(richResponses, (richResponse) => {
        try {
            richResponse.data = JSON.parse(handlebars.compile(richResponse.data)(templateContext));
            return richResponse;
        } catch (error) {
            console.log(error);
            return richResponse;
        }
    })
    return parsedRichResponses;

};
