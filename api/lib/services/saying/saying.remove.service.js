import _ from 'lodash';
import {
    MODEL_KEYWORD,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id = null, SayingModel = null, AgentModel, CategoryModel }) {

    const { redis } = this.server.app;
    const { categoryService, globalService } = this.server.services();
    if (id === null && SayingModel === null) {
        return Promise.reject(GlobalDefaultError({
            message: 'Saying id or model needed'
        }));
    }
    try {
        SayingModel = SayingModel || await redis.factory(MODEL_SAYING, id);
        const removedKeywordIds = _.map(SayingModel.property('keywords'), 'keywordId');
        const removedKeywordModels = await globalService.loadAllByIds({
            ids: removedKeywordIds, //Only load the keywords we are going to use
            model: MODEL_KEYWORD,
            returnModel: true
        });
        await categoryService.unlinkKeywords({ model: CategoryModel, keywordModels: removedKeywordModels });

        // Update status
        AgentModel.property('status', STATUS_OUT_OF_DATE);
        CategoryModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.saveInstance();
        await CategoryModel.saveInstance();
        return await SayingModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${MODEL_KEYWORD} id=[${id}]` });
    }

};
