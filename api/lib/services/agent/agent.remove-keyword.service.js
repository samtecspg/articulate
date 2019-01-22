import {
    MODEL_AGENT,
    MODEL_KEYWORD
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, keywordId }) {

    const { globalService, keywordService } = await this.server.services();
    try {

        const modelPath = [MODEL_AGENT, MODEL_KEYWORD];
        const modelPathIds = [id, keywordId];
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const KeywordModel = models[MODEL_KEYWORD];
        return await keywordService.remove({ KeywordModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
