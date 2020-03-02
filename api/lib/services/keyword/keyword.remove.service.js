import {
    MODEL_CATEGORY,
    MODEL_KEYWORD
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, KeywordModel, isBulk = false }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    try {
        KeywordModel = KeywordModel || await redis.factory(MODEL_KEYWORD, id);
        if (isBulk) {
            return KeywordModel.removeInstance();
        }
        //const keywordCategoryIds = await KeywordModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY);
        const categories = await globalService.loadAllLinked({ parentModel: KeywordModel, model: MODEL_CATEGORY });
        if (categories.length > 0) {
            const keywordName = await KeywordModel.allProperties().keywordName;
            const categoriesNames = categories.map((category) => {

                return category.categoryName;
            });
            return Promise.reject(GlobalDefaultError({
                statusCode: 400,
                message: `Keyword '${keywordName}' is been used by the following category(s): ${categoriesNames.join(', ')}`
            }));
        }
        // TODO: Find any Action.slots or Saying.keywords that contains this ID?
        return KeywordModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${MODEL_KEYWORD} id=[${id}]` });
    }

};
