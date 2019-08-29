import {
    ROUTE_AGENT,
    ROUTE_CONVERSE
} from '../../../util/constants';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function ({ actionData, CSO }) {

    const { channelService, documentService, contextService, agentService } = await this.server.services();

    //We extract the values of the response given that we want to return just a part of them
    CSO.cleanResponse = {
        docId: CSO.docId,
        textResponse: CSO.response.textResponse,
        fulfilled: CSO.response.fulfilled,
        actions: CSO.response.actions ? CSO.response.actions : [],
        isFallback: CSO.response.isFallback,
        quickResponses: CSO.response.quickResponses
    };

    //This will store the final response in CSO.finalResponse
    await agentService.converseProcessPostFormat({ actionData, CSO });

    if (CSO.response.webhook) {
        const webhookKey = Object.keys(CSO.response.webhook)[0];
        CSO.processedWebhooks[webhookKey] = CSO.response.webhook[webhookKey];
    }

    CSO.processedResponses.push(CSO.finalResponse);

    if (CSO.context.docIds.indexOf(CSO.docId) === -1){
        CSO.context.docIds.push(CSO.docId);
    }

    const converseResult = {
        ...CSO.finalResponse,
        responses: CSO.processedResponses
    };

    const prunnedCSO = {
        docId: CSO.docId,
        context: CSO.context,
        currentAction: CSO.currentAction,
        parse: CSO.parse,
        webhooks: CSO.processedWebhooks
    };

    const fullConverseResult = {
        ...converseResult,
        CSO: prunnedCSO
    };

    await documentService.update({ 
        id: CSO.docId,
        data: { 
            converseResult: fullConverseResult
        }
    });

    await contextService.update({
        sessionId: CSO.context.sessionId,
        data: {
            savedSlots: CSO.context.savedSlots,
            docIds: CSO.context.docIds,
            actionQueue: CSO.context.actionQueue
        }
    });

    //Once we store the webhook response in the document we need to convert it back to an object
    Object.keys(prunnedCSO.webhooks).forEach((webhookKey) => {

        prunnedCSO.webhooks[webhookKey].response = JSON.parse(prunnedCSO.webhooks[webhookKey].response);
    });

    const responseForUbiquity = CSO.debug ? fullConverseResult : converseResult; 

    if (CSO.ubiquity && CSO.ubiquity.connection && CSO.ubiquity.connection.details.outgoingMessages){

        channelService.reply({ connection: CSO.ubiquity.connection, event: CSO.ubiquity.event, response: responseForUbiquity });
        await timeout(CSO.ubiquity.connection.details.waitTimeBetweenMessages);
    }
    else {
        this.server.publish(`/${ROUTE_AGENT}/${CSO.agent.id}/${ROUTE_CONVERSE}`, responseForUbiquity );
    }
};