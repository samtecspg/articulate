import _ from 'lodash';

module.exports = function ({ quickResponses, templateContext }) {

    const { handlebars } = this.server.app;

    if (!quickResponses || quickResponses.length === 0) {
        return null;
    }

    try {
        let parsedQuickResponses = _.map(quickResponses, (response, index) => {
            return handlebars.compile(response)(templateContext);
        })
        return parsedQuickResponses;
    } catch (error) {
        console.log(error);
        return null;
    }
};
