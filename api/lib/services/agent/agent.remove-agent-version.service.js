import { MODEL_AGENT, MODEL_KEYWORD } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import GlobalDefaultError from '../../errors/global.default-error';

module.exports = async function (
    { id }
) {
    const { agentVersionService } = await this.server.services();
    try {
        return await agentVersionService.delete({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
