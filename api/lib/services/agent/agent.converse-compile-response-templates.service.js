import _ from 'lodash';

module.exports = async function ({ responses, templateContext, isTextPrompt = false, promptCount }) {

    const { handlebars } = this.server.app;
    const { agentService } = await this.server.services();

    let parsedResponses = await Promise.all(_.map(responses, async (response, index) => {

        if (!promptCount || (promptCount && ((promptCount - 1) === index) || (promptCount > responses.length && index === (responses.length - 1) )) ){
            response = isTextPrompt ? { textResponse: response, actions: [] } : response;
            const match = response.textResponse.match(/{{/g);
            const numberOfSlots = match ? match.length : 0;
            const compiledResponse = handlebars.compile(response.textResponse, { strict: true });
            try {
                const richResponses = await agentService.converseCompileRichResponsesTemplates({ richResponses: response.richResponses, templateContext });
                return { textResponse: compiledResponse(templateContext), numberOfSlots, actions: response.actions, richResponses, disableTextResponse: response.disableTextResponse };
            }
            catch (error) {
                console.error(error);
                return null;
            }
        }
        else {
            return null;
        }
    }));

    parsedResponses = _.compact(parsedResponses);
    if (parsedResponses.length > 0) {

        parsedResponses = _.filter(parsedResponses, (parsedResponse) => {

            return parsedResponse.textResponse !== '';
        });
    }

    if (parsedResponses.length > 0) {

        const maxNumberOfExpressions = _.max(_.map(parsedResponses, 'numberOfSlots'));
        parsedResponses = _.filter(parsedResponses, (parsedResponse) => {

            return parsedResponse.numberOfSlots === maxNumberOfExpressions;
        });
    }

    if (parsedResponses.length > 0 ){
        return parsedResponses[Math.floor(Math.random() * parsedResponses.length)];
    }
    return { textResponse: 'Sorry we’re not sure how to respond.', actions: [] };
};
