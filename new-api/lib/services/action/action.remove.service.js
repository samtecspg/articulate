import {
    MODEL_ACTION,
    MODEL_POST_FORMAT,
    MODEL_WEBHOOK,
    MODEL_SAYING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import GlobalDefaultError from '../../errors/global.default-error';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    const { postFormatService, webhookService } = await this.server.services();
    const ActionModel = await redis.factory(MODEL_ACTION);
    try {

        await ActionModel.findById({ id });
        const actionSayingIds = await ActionModel.getAll(MODEL_SAYING, MODEL_SAYING);
        if (actionSayingIds.length > 0) {
            const actionName = await ActionModel.allProperties().actionName;
            return Promise.reject(GlobalDefaultError({
                statusCode: 400,
                message: `Action '${actionName}' is been used by ${actionSayingIds.length} sayings`
            }));
        }
        const postFormatIds = await ActionModel.getAll(MODEL_POST_FORMAT, MODEL_POST_FORMAT);
        const webhookIds = await ActionModel.getAll(MODEL_WEBHOOK, MODEL_WEBHOOK);
        const removePostFormatPromises = postFormatIds.map(async (postFormatId) => {

            return await postFormatService.remove({ id: postFormatId });
        });
        await Promise.all(removePostFormatPromises);

        const removeWebhookPromises = webhookIds.map(async (webhookId) => {

            return await webhookService.remove({ id: webhookId });
        });
        await Promise.all(removeWebhookPromises);
        return ActionModel.removeInstance({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${MODEL_ACTION} id=[${id}]` });
    }

};
