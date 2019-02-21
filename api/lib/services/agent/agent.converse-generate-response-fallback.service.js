module.exports = function ({ agent, conversationStateObject }) {

    const fallbackAction = agent.actions.filter((action) => {
        return action.actionName === agent.fallbackAction;
    })[0];

    if (fallbackAction.useWebhook || agent.useWebhook) {
        let modelPath, webhook;
        if (fallbackAction.useWebhook){
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: agent.id
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
                    id: agent.id
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
            templateContext: conversationStateObject
        });
        if (webhookResponse.textResponse) {
            return { textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions : [], actionWasFulfilled: true, webhookResponse };
        }
        conversationStateObject.webhookResponse = { ...webhookResponse };
        const response = await agentService.converseCompileResponseTemplates({ responses: fallbackAction.responses, templateContext: conversationStateObject });
        return { ...response, webhookResponse, actionWasFulfilled: true };
    }
    const selectedFallbackResponse = fallbackAction.responses[Math.floor(Math.random() * fallbackAction.responses.length)];
    return { textResponse: selectedFallbackResponse.textResponse, actions: selectedFallbackResponse.actions, actionWasFulfilled: true };
};
