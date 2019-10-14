import _ from 'lodash';
const { JSONPath } = require('jsonpath-plus');

import {
    MODEL_KEYWORD,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id = null, SayingModel = null, AgentModel, CategoryModel }) {

    const { redis } = this.server.app;
    const { categoryService, globalService, agentService } = this.server.services();
    if (id === null && SayingModel === null) {
        return Promise.reject(GlobalDefaultError({
            message: 'Saying id or model needed'
        }));
    }
    try {

        SayingModel = SayingModel || await redis.factory(MODEL_SAYING, id);
        var possibleRemovedKeywordIds = _.map(SayingModel.property('keywords'), 'keywordId');

        var remainingSayingsOnAgentFromCategoryWithKeywords = await agentService.findAllSayings({ id: AgentModel.id, loadCategoryId: true, skip: 0, limit: -1 });
        remainingSayingsOnAgentFromCategoryWithKeywords = _.filter(remainingSayingsOnAgentFromCategoryWithKeywords.data, function (saying) {
            return saying.keywords &&
                saying.keywords.length > 0 &&
                saying.category == CategoryModel.id &&
                saying.id != SayingModel.id;
        });
        var remainingKeywordIds = _.union(JSONPath({ path: '$.[*].keywords[*].keywordId', json: remainingSayingsOnAgentFromCategoryWithKeywords }));
        const removedKeywordIds = _.difference(possibleRemovedKeywordIds, remainingKeywordIds)

        if (removedKeywordIds.length > 0) {
            const removedKeywordModels = await globalService.loadAllByIds({
                ids: removedKeywordIds, //Only load the keywords we are going to use
                model: MODEL_KEYWORD,
                returnModel: true
            });

            await categoryService.unlinkKeywords({ model: CategoryModel, keywordModels: removedKeywordModels });

            CategoryModel.property('status', STATUS_OUT_OF_DATE);
            await CategoryModel.saveInstance();
        }

        // Update status
        AgentModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.saveInstance();
        return await SayingModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${MODEL_KEYWORD} id=[${id}]` });
    }

};
