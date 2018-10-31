import {
    MODEL_AGENT,
    MODEL_WEBHOOK
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    const WebhookModel = await redis.factory(MODEL_WEBHOOK);
    try {

        const agent = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const ids = await agent.getAll(MODEL_WEBHOOK, MODEL_WEBHOOK);

        await Promise.all(ids.map(async (currentId) => {

            return await WebhookModel.removeInstance({ id: currentId });
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
