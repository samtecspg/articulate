import { MODEL_KEYWORD } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, agent = null, returnModel = false }) {

    const { redis } = this.server.app;
    const KeywordModel = await redis.factory(MODEL_KEYWORD);
    try {
        await KeywordModel.createInstance({ data });
        if (agent) {
            await agent.link(KeywordModel, MODEL_KEYWORD);
            await agent.save();
        }
        return returnModel ? KeywordModel : KeywordModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
