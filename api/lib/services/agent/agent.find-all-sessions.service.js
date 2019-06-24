import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import _ from 'lodash';

module.exports = async function ({ id, direction, skip, limit, field }) {

    const { globalService, documentService, contextService } = await this.server.services();

    try {
        await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const agentDocuments = await documentService.findByAgentId({ agentId: id });
        const sessionIds = _.uniq(_.map(agentDocuments.data, 'session'));
        const sessions = await Promise.all(sessionIds.map(async (sessionId) => {

            return await contextService.findBySession({ sessionId, loadFrames: true });
        }));
        return {
            data: _.orderBy(_.take(_.drop(sessions, skip), limit === -1 ? sessionIds.length : limit), field, direction),
            totalCount: sessionIds.length
        };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
