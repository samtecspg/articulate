import { 
    MODEL_AGENT,
    MODEL_SAYING,
    MODEL_DOMAIN
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import _ from 'lodash';

const defaults = {
    SKIP: 0,
    LIMIT: 50,
    DIRECTION: 'ASC'
};

module.exports = async function ({ id, loadDomainId, skip = defaults.SKIP, limit = defaults.LIMIT, direction = defaults.DIRECTION, field }) {

    const { globalService } = await this.server.services();
    try {
        const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const sayingsIds = await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING);
        const SayingModels = await globalService.loadAllByIds({ ids: sayingsIds, model: MODEL_SAYING, returnModel: true });
        const data = await Promise.all(SayingModels.map(async (sayingModel) => {
            const saying = await sayingModel.allProperties();
            if (loadDomainId) {
                const domainsId = await sayingModel.getAll(MODEL_DOMAIN, MODEL_DOMAIN);
                return { ...saying, ...{ domain: domainsId[0] } };
            }
            return saying;
        }));

        let sortedSayings = [];
        if (field) {
            sortedSayings = _.orderBy(data, [saying => typeof saying[field] === 'string' ? saying[field].toLowerCase() : saying[field]], direction);
            sortedSayings = sortedSayings.slice(skip, skip + limit);
        }
        else {
            if (limit === -1){
                sortedSayings = data.slice(skip, data.length);
            }
            else {
                sortedSayings = data.slice(skip, skip + limit);
            }
        }
        if (sortedSayings.length === 0) {
            return { data: [], totalCount: 0 };
        }

        return { data: sortedSayings, totalCount: data.length };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
