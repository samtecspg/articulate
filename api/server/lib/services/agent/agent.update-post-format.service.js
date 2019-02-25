import {
    MODEL_AGENT,
    MODEL_POST_FORMAT
} from '../../../util/constants';
import NotFoundError from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, postFormatData, returnModel = false }) {

    const { globalService } = await this.server.services();
    try {

        const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const ids = await AgentModel.getAll(MODEL_POST_FORMAT, MODEL_POST_FORMAT);
        const PostFormatModel = await globalService.findById({ id: ids[0], model: MODEL_POST_FORMAT, returnModel: true });
        if (PostFormatModel.inDb) {
            await PostFormatModel.updateInstance({ data: postFormatData });
            return returnModel ? PostFormatModel : PostFormatModel.allProperties();
        }
        return Promise.reject(NotFoundError({ model: MODEL_POST_FORMAT }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
