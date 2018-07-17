import {
    MODEL_CATEGORY,
    MODEL_KEYWORD
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

const logger = require('../../../util/logger')({ name: `service:category:link-keywords` });

module.exports = async function ({ model, keywordModels = [] }) {

    logger.debug(keywordModels.length);
    if (keywordModels.length === 0) {
        return;
    }
    try {
        const linkPromises = keywordModels.map(async (KeywordModel) => {

            await KeywordModel.link(model, MODEL_CATEGORY);
            await model.link(KeywordModel, MODEL_KEYWORD);
            return await KeywordModel.save();
        });
        await Promise.all(linkPromises);
        await model.save();
        logger.debug('complete');
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }

};
