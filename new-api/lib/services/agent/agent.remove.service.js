import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    const Agent = await redis.factory(MODEL_AGENT);
    try {
        //TODO: Delete Domains
        //TODO: Delete Keyword
        //TODO: Delete agentDomainRecognizer

        await Agent.findById({ id });
        return Agent.removeInstance({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Agent id=[${id}]` });
    }

};
