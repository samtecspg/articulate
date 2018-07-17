import {
    MODEL_AGENT,
    MODEL_POST_FORMAT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import RedisOnlyOneLinkedError from '../../errors/redis.only-one-linked-error';

module.exports = async function (
    {
        id,
        postFormatData,
        AgentModel = null,
        returnModel = false
    }
) {

    const { globalService, postFormatService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const children = await AgentModel.getAll(MODEL_POST_FORMAT, MODEL_POST_FORMAT);
        if (children.length > 0) {
            return Promise.reject(RedisOnlyOneLinkedError({
                mainType: MODEL_AGENT,
                mainId: id,
                subType: MODEL_POST_FORMAT
            }));
        }
        return await postFormatService.create({
            data: postFormatData,
            parent: AgentModel,
            returnModel
        });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
