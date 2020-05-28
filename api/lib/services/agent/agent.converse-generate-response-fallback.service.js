import { MODEL_AGENT, MODEL_ACTION, MODEL_WEBHOOK } from '../../../util/constants';
const { VM, VMScript } = require('vm2');

module.exports = async function ({ CSO }) {

    const { agentService, globalService } = await this.server.services();

    const fallbackAction = CSO.agent.actions.find((action) => {
        return action.actionName === CSO.agent.fallbackAction;
    });

    if (fallbackAction.useWebhook || CSO.agent.useWebhook) {
        let modelPath, webhook;
        if (fallbackAction.useWebhook) {
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
            webhook = await globalService.findInModelPath({ modelPath, isFindById: false, isSingleResult: true, skip: 0, limit: -1 });
        }
        if (webhook.preScript) {
            const vm = new VM({
                timeout: 1000,
                sandbox: {
                    CSO
                }
            });

            const script = new VMScript(webhook.preScript);
            try {
                CSO = vm.run(script);
            } catch (err) {
                console.error(`Failed to execute preScript of the webhook ${webhook.webhookKey}`, err);
            }
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
        CSO.webhook = {
            [webhook.webhookKey]: { ...webhookResponse }
        };
        if (webhook.postScript) {
            const vm = new VM({
                timeout: 1000,
                sandbox: {
                    CSO
                }
            });

            const script = new VMScript(webhook.postScript);
            try {
                CSO = vm.run(script);
            } catch (err) {
                console.error(`Failed to execute postScript of the webhook ${webhook.webhookKey}`, err);
            }
        }
        if (webhookResponse.textResponse) {
            return { textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions : [], fulfilled: true, webhook: { [webhook.webhookKey]: webhookResponse }, isFallback: true };
        }
        const response = await agentService.converseCompileResponseTemplates({ responses: fallbackAction.responses, templateContext: CSO });
        return { ...response, webhook: { [webhook.webhookKey]: webhookResponse }, fulfilled: true, isFallback: true };
    }
    const selectedFallbackResponse = fallbackAction.responses[Math.floor(Math.random() * fallbackAction.responses.length)];
    return { textResponse: selectedFallbackResponse.textResponse, actions: selectedFallbackResponse.actions, fulfilled: true, isFallback: true };
};
