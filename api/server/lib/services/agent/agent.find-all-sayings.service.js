import _ from 'lodash';
import {
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_SAYING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, loadCategoryId, skip, limit, direction, field, filter = {} }) {

    const { globalService } = await this.server.services();
    const { redis } = this.server.app;

    try {
        const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const sayingsIds = await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING);
        let {
            category: categoryFilter = [],
            actions: actionFilter = [],
            query,
            ...restOfFilters
        } = filter;
        let newFilter = restOfFilters;
        if (query) {
            newFilter = { ...newFilter, ...{ userSays: query } };
        }
        const allSayings = await Promise.all(sayingsIds.map(async (sayingId) => {

            return await globalService.loadWithIncludes({
                model: MODEL_SAYING,
                id: sayingId,
                relationNames: [MODEL_CATEGORY, MODEL_ACTION]
            });
        }));
        categoryFilter = _.isArray(categoryFilter) ? categoryFilter : [categoryFilter];
        actionFilter = _.isArray(actionFilter) ? actionFilter : [actionFilter];
        let filteredSayings = allSayings;
        if (categoryFilter.length > 0) {
            filteredSayings = filteredSayings.filter((saying) => {
                const categories = _.map(saying[MODEL_CATEGORY], 'categoryName');
                return _.includes(categories, ...categoryFilter);
            });
        }

        if (actionFilter.length > 0) {
            filteredSayings = filteredSayings.filter((saying) => {
                return _.includes(saying.actions, ...actionFilter);
            });
        }

        const SayingModel = await redis.factory(MODEL_SAYING);
        // Can't perform a count with a filter, so we need to query all the sayings and then apply the filter
        const SayingModelsCount = await SayingModel.findAllByIds({
            ids: _.map(filteredSayings, 'id'),
            limit: -1,
            filter: newFilter
        });
        const SayingModels = await SayingModel.findAllByIds({
            ids: _.map(filteredSayings, 'id'),
            skip,
            limit,
            direction,
            field,
            filter: newFilter
        });

        const totalCount = SayingModelsCount.length;
        const data = SayingModels.map((sayingModel) => {

            const saying = _.find(filteredSayings, { id: sayingModel.id });
            if (loadCategoryId) {
                return {
                    // ..._.omit(saying, [MODEL_CATEGORY, MODEL_ACTION]),
                    ...saying,
                    ...{
                        category: _.get(saying, `${MODEL_CATEGORY}[0].id`, null)
                    }
                };
            }

            //return _.omit(saying, [MODEL_CATEGORY, MODEL_ACTION]);
            return saying;

        });
        return { data, totalCount };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
