import {
    MODEL_AGENT,
    MODEL_DOMAIN,
    MODEL_SAYING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, loadDomainId, skip, limit, direction, field }) {

    const { globalService } = await this.server.services();
    const { redis } = this.server.app;

    try {
        const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const sayingsIds = await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING);
        const SayingModel = await redis.factory(MODEL_SAYING);
        const totalCount = await SayingModel.count();

        const SayingModels = await SayingModel.findAllByIds({ ids: sayingsIds, skip, limit, direction, field });
        const data = await Promise.all(SayingModels.map(async (sayingModel) => {

            const saying = await sayingModel.allProperties();
            if (loadDomainId) {
                const domainsId = await sayingModel.getAll(MODEL_DOMAIN, MODEL_DOMAIN);
                return { ...saying, ...{ domain: domainsId[0] } };
            }
            return saying;
        }));

        return { data, totalCount };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};