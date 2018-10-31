import {
    MODEL_AGENT,
    MODEL_WEBHOOK
} from '../../../util/constants';
import NotFoundError from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, webhookData, returnModel = false }) {

    const { globalService } = await this.server.services();
    try {

        const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const ids = await AgentModel.getAll(MODEL_WEBHOOK, MODEL_WEBHOOK);
        const WebhookModel = await globalService.findById({ id: ids[0], model: MODEL_WEBHOOK, returnModel: true });
        if (WebhookModel.inDb) {
            await WebhookModel.updateInstance({ data: webhookData });
            return returnModel ? WebhookModel : WebhookModel.allProperties();
        }
        return Promise.reject(NotFoundError({ model: MODEL_WEBHOOK }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
