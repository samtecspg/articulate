import {
    MODEL_AGENT,
    MODEL_POST_FORMAT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    const PostFormatModel = await redis.factory(MODEL_POST_FORMAT);
    try {

        const agent = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const ids = await agent.getAll(MODEL_POST_FORMAT, MODEL_POST_FORMAT);

        await Promise.all(ids.map(async (currentId) => {

            return await PostFormatModel.removeInstance({ id: currentId });
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
