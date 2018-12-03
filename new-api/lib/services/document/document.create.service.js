import {
    MODEL_DOCUMENT,
    PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE,
    PARAM_DOCUMENT_MAXIMUM_SAYING_SCORE,
    PARAM_DOCUMENT_RASA_RESULTS,
    PARAM_DOCUMENT_TIME_STAMP,
    PARAM_DOCUMENT_TOTAL_ELAPSED_TIME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function (
    {
        document,
        timeStamp,
        maximumSayingScore,
        maximumCategoryScore,
        totalElapsedTimeMS,
        rasaResults,
        returnModel = false
    }) {

    const { redis } = this.server.app;
    const DocumentModel = await redis.factory(MODEL_DOCUMENT);
    try {
        await DocumentModel.createInstance({
            data: {
                document,
                [PARAM_DOCUMENT_TIME_STAMP]: timeStamp,
                [PARAM_DOCUMENT_MAXIMUM_SAYING_SCORE]: maximumSayingScore,
                [PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE]: maximumCategoryScore,
                [PARAM_DOCUMENT_TOTAL_ELAPSED_TIME]: totalElapsedTimeMS,
                [PARAM_DOCUMENT_RASA_RESULTS]: rasaResults
            }
        });
        return returnModel ? DocumentModel : DocumentModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
