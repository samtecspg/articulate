import {
    MODEL_DOMAIN,
    MODEL_KEYWORD
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, KeywordModel }) {

    const { redis } = this.server.app;
    try {
        KeywordModel = KeywordModel || await redis.factory(MODEL_KEYWORD, id);
        const keywordDomainIds = await KeywordModel.getAll(MODEL_DOMAIN, MODEL_DOMAIN);
        if (keywordDomainIds > 0) {
            return Promise.reject(GlobalDefaultError({
                message: `Keyword id=[${KeywordModel.id}] is been used by the domain(s) =[${keywordDomainIds.join()}]`
            }));
        }
        // TODO: Find any Action.slots or Saying.keywords that contains this ID?
        return KeywordModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${MODEL_KEYWORD} id=[${id}]` });
    }

};
