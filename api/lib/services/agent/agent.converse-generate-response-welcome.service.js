import { MODEL_AGENT, MODEL_ACTION, MODEL_WEBHOOK } from '../../../util/constants';
const { VM, VMScript } = require('vm2');

module.exports = async function ({ CSO }) {

    const { agentService, globalService } = await this.server.services();

    const welcomeAction = CSO.agent.actions.find((action) => {
        return action.actionName === CSO.agent.welcomeAction;
    });

    if (welcomeAction.useWebhook || CSO.agent.useWebhook) {
        let modelPath, webhook;
        if (welcomeAction.useWebhook) {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: CSO.agent.id
                },
                {
                    model: MODEL_ACTION,
                    id: welcomeAction.id
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
            return { textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions : [], fulfilled: true, webhook: { [webhook.webhookKey]: webhookResponse }, isWelcome: true };
        }
        const response = await agentService.converseCompileResponseTemplates({ responses: welcomeAction.responses, templateContext: CSO });
        return { ...response, webhook: { [webhook.webhookKey]: webhookResponse }, fulfilled: true, isWelcome: true };
    }
    const selectedWelcomeResponse = welcomeAction.responses[Math.floor(Math.random() * welcomeAction.responses.length)];
    return { textResponse: selectedWelcomeResponse.textResponse, actions: selectedWelcomeResponse.actions, fulfilled: true, isWelcome: true };
};
