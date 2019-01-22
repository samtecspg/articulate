import {
    MODEL_AGENT,
    MODEL_CATEGORY
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function (
    {
        id,
        categoryData,
        AgentModel = null,
        returnModel = false
    }
) {

    const { globalService, categoryService, agentService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const isValid = await agentService.isModelUnique({
            AgentModel,
            model: MODEL_CATEGORY,
            field: 'categoryName',
            value: categoryData.categoryName
        });
        if (isValid) {

            return await categoryService.create({ data: categoryData, agent: AgentModel, returnModel });

        }
        return Promise.reject(GlobalDefaultError({
            message: `The ${MODEL_AGENT} already has a ${MODEL_CATEGORY} with the name= "${categoryData.categoryName}".`
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
