import {
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_WEBHOOK
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, actionId, data, returnModel = false }) {

    const { globalService, webhookService } = await this.server.services();

    try {
        const modelPath = [
            { model: MODEL_AGENT, id },
            { model: MODEL_ACTION, id: actionId }
        ];
        let actionModel = await globalService.findInModelPath({ modelPath, returnModel: true });
        actionModel = actionModel.data;
        const children = await actionModel.getAll(MODEL_WEBHOOK, MODEL_WEBHOOK);
        if (children.length > 0) { // Update
            return await webhookService.update({
                id: children[0],
                data,
                returnModel
            });

        } // Create

        return await webhookService.create({
            data,
            parent: actionModel,
            returnModel
        });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
