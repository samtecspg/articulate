import {
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_WEBHOOK
} from '../../../util/constants';
import GlobalNotFound from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, actionId }) {

    const { globalService, webhookService } = await this.server.services();

    try {
        const modelPath = [
            { model: MODEL_AGENT, id },
            { model: MODEL_ACTION, id: actionId }
        ];
        let actionModel = await globalService.findInModelPath({ modelPath, returnModel: true });
        actionModel = actionModel.data;
        const children = await actionModel.getAll(MODEL_WEBHOOK, MODEL_WEBHOOK);
        if (children.length > 0) {
            return await webhookService.remove({
                id: children[0]
            });
        }

        return Promise.reject(GlobalNotFound({ model: MODEL_WEBHOOK }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
