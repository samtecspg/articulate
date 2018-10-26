import _ from 'lodash';
import {
    MODEL_KEYWORD,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id = null, SayingModel = null, AgentModel, DomainModel }) {

    const { redis } = this.server.app;
    const { domainService, globalService } = this.server.services();
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
        await domainService.unlinkKeywords({ model: DomainModel, keywordModels: removedKeywordModels });

        // Update status
        AgentModel.property('status', STATUS_OUT_OF_DATE);
        DomainModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.save();
        await DomainModel.save();
        return await SayingModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${MODEL_KEYWORD} id=[${id}]` });
    }

};
