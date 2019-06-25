import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import _ from 'lodash';

module.exports = async function ({ id, direction, skip, limit, field }) {

    const { globalService, documentService, contextService } = await this.server.services();

    try {
        await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const agentDocuments = await documentService.findByAgentId({ agentId: id });
        const sessionIds = _.uniq(_.map(agentDocuments.data, 'session'));
        let sessions = await Promise.all(sessionIds.map(async (sessionId) => {

            try {
                return await contextService.findBySession({ sessionId, loadFrames: true });
            }
            catch(e){
                //There could be cases where the session doesn't exists anymore
                return null;
            }
        }));
        sessions = _.compact(sessions);
        return {
            data: _.orderBy(_.take(_.drop(sessions, skip), limit === -1 ? sessions.length : limit), field, direction),
            totalCount: sessions.length
        };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
