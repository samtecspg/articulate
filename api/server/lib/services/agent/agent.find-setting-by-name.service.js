import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, name }) {

    const { globalService } = await this.server.services();
    try {

        const agent = await globalService.findById({ id, model: MODEL_AGENT });
        return await agent.settings[name];
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
