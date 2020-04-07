import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import _ from 'lodash';

module.exports = async function ({ id, direction, skip, limit, field }) {

    const { globalService, documentService } = await this.server.services();

    try {
        await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const sessions = await documentService.findAllSessions({ agentId: id });
        return {
            data: _.take(_.drop(sessions.data, skip), limit === -1 ? sessions.length : limit),
            totalCount: sessions.data.length
        };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
