import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_SAYING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, loadCategoryId, skip, limit, direction, field, filter }) {

    const { globalService } = await this.server.services();
    const { redis } = this.server.app;

    try {
        const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const sayingsIds = await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING);
        const SayingModel = await redis.factory(MODEL_SAYING);
        const totalCount = sayingsIds.length;
        let {
            category: categoryFilter,
            ...restOfFilters
        } = filter;
        const SayingModels = await SayingModel.findAllByIds({ ids: sayingsIds, skip, limit, direction, field, filter: restOfFilters });
        const data = await Promise.all(SayingModels.map(async (sayingModel) => {

            const saying = await sayingModel.allProperties();
            if (loadCategoryId) {
                const categoriesId = await sayingModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY);
                return { ...saying, ...{ category: categoriesId[0] } };
            }
            return saying;
        }));
        if (loadCategoryId && filter.category) {
            categoryFilter = _.isArray(filter.category) ? filter.category : [filter.category];
            const filteredData = _.filter(data, (saying) => {

                return _.includes(categoryFilter, _.toNumber(saying.category));
            });
            return { data: filteredData, totalCount };
        }
        return { data, totalCount };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
