import _ from 'lodash';

module.exports = function ({ quickResponses, templateContext }) {

    const { handlebars } = this.server.app;

    if (!quickResponses || quickResponses.length === 0) {
        return null;
    }

    let parsedQuickResponses = _.map(quickResponses, (response, index) => {
        var compiledQuickResponse;
        try {
            compiledQuickResponse = handlebars.compile(response)(templateContext);
        } catch (error) {
            console.log(error);
            compiledQuickResponse = '';
        }
        if (compiledQuickResponse !== '') {
            return compiledQuickResponse;
        }
        else {
            return null;
        }
    })
    return parsedQuickResponses.filter(Boolean);

};
