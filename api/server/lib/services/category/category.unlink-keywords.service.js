import _ from 'lodash';
import {
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_SAYING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

//const logger = require('../../../server/util/logger')({ name: `service:category:unlink-keywords` });

module.exports = async function ({ model, keywordModels = [] }) {

    if (keywordModels.length === 0) {
        return;
    }
    const { globalService } = await this.server.services();
    try {
        const linkPromises = keywordModels.map(async (KeywordModel) => {

            const keywordSayingIds = await KeywordModel.getAll(MODEL_SAYING, MODEL_SAYING);
            const KeywordSayingModels = await globalService.loadAllByIds({
                ids: keywordSayingIds,
                model: MODEL_SAYING
            });

            const belongsToPromises = KeywordSayingModels.map(async (SayingModel) => {

                return await model.belongsTo(SayingModel, MODEL_SAYING);
            });

            const sayingBelongsTo = await Promise.all(belongsToPromises);
            // The sayings related to this keyword are not used in the same category
            if (sayingBelongsTo.length === 0 || _.findIndex(sayingBelongsTo) === 0) {
                await KeywordModel.unlink(model, MODEL_CATEGORY);
                await model.unlink(KeywordModel, MODEL_KEYWORD);
                return await KeywordModel.save();
            }
        });
        await Promise.all(linkPromises);
        await model.save();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }

};
