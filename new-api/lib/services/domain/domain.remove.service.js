import {
    MODEL_DOMAIN,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, DomainModel, AgentModel }) {

    const { redis } = this.server.app;
    try {
        const SayingModel = await redis.factory(MODEL_SAYING);
        DomainModel = DomainModel || await redis.factory(MODEL_DOMAIN, id);
        const domainSayingIds = await DomainModel.getAll(MODEL_SAYING, MODEL_SAYING);
        await Promise.all(domainSayingIds.map(async (currentId) => {

            return await SayingModel.removeInstance({ id: currentId });
        }));

        AgentModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.save();
        return DomainModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Domain id=[${id}]` });
    }

};
