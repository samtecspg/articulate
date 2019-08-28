import { MODEL_AGENT, MODEL_ACTION, MODEL_WEBHOOK } from '../../../util/constants';

module.exports = async function ({ CSO }) {
    
    const { agentService, globalService } = await this.server.services();

    const fallbackAction = CSO.agent.actions.find((action) => {
        return action.actionName === CSO.agent.fallbackAction;
    });

    if (fallbackAction.useWebhook || CSO.agent.useWebhook) {
        let modelPath, webhook;
        if (fallbackAction.useWebhook){
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: CSO.agent.id
                },
                {
                    model: MODEL_ACTION,
                    id: fallbackAction.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
            webhook = await globalService.findInModelPath({ modelPath, isFindById: false, isSingleResult: true });
        }
        else {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: CSO.agent.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
            webhook = await globalService.findInModelPath({ modelPath, isFindById, isSingleResult, skip, limit, direction, field });
        }
        const webhookResponse = await agentService.converseCallWebhook({
            url: webhook.webhookUrl,
            templatePayload: webhook.webhookPayload,
            payloadType: webhook.webhookPayloadType,
            method: webhook.webhookVerb,
            headers: webhook.webhookHeaders,
            username: webhook.webhookUser ? webhook.webhookUser : undefined,
            password: webhook.webhookPassword ? webhook.webhookPassword : undefined,
            templateContext: CSO
        });
        if (webhookResponse.textResponse) {
            return { textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions : [], fulfilled: true, webhook: webhookResponse, isFallback: true };
        }
        CSO.webhook = { ...webhookResponse };
        const response = await agentService.converseCompileResponseTemplates({ responses: fallbackAction.responses, templateContext: CSO });
        return { ...response, webhook: webhookResponse, fulfilled: true, isFallback: true };
    }
    const selectedFallbackResponse = fallbackAction.responses[Math.floor(Math.random() * fallbackAction.responses.length)];
    return { textResponse: selectedFallbackResponse.textResponse, actions: selectedFallbackResponse.actions, fulfilled: true, isFallback: true };
};
