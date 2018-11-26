import {
    MODEL_AGENT,
    MODEL_DOMAIN
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function (
    {
        id,
        domainData,
        AgentModel = null,
        returnModel = false
    }
) {

    const { globalService, domainService, agentService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const isValid = await agentService.isModelUnique({
            AgentModel,
            model: MODEL_DOMAIN,
            field: 'domainName',
            value: domainData.domainName
        });
        if (isValid) {

            return await domainService.create({ data: domainData, agent: AgentModel, returnModel });

        }
        return Promise.reject(GlobalDefaultError({
            message: `The ${MODEL_AGENT} already has a ${MODEL_DOMAIN} with the name= "${domainData.domainName}".`
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
