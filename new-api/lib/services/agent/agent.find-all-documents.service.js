import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { globalService, documentService } = await this.server.services();

    try {
        await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        return await documentService.findByAgentId({ agentId: id });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
