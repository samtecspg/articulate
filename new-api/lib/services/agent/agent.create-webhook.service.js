import {
    MODEL_AGENT,
    MODEL_WEBHOOK
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import RedisOnlyOneLinkedError from '../../errors/redis.only-one-linked-error';

module.exports = async function (
    {
        id,
        AgentModel = null,
        webhookData,
        returnModel = false
    }
) {

    const { globalService, webhookService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const children = await AgentModel.getAll(MODEL_WEBHOOK, MODEL_WEBHOOK);
        if (children.length > 0) {
            return Promise.reject(RedisOnlyOneLinkedError({
                mainType: MODEL_AGENT,
                mainId: id,
                subType: MODEL_WEBHOOK
            }));
        }
        return await webhookService.create({
            data: webhookData,
            parent: AgentModel,
            returnModel
        });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
