import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_SAYING,
    RASA_MODEL_CATEGORY_RECOGNIZER,
    RASA_MODEL_JUST_ER,
    RASA_MODEL_MODIFIERS
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id = null, AgentModel = null }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    const getFirstSayingName = async ({ CategoryModel }) => {

        const categorySayingsIds = await CategoryModel.getAll(MODEL_SAYING, MODEL_SAYING);
        const firstCategorySayingId = categorySayingsIds[0];
        const firstCategorySaying = await globalService.findById({ id: firstCategorySayingId, model: MODEL_SAYING });
        return firstCategorySaying.actions.join('+');
    };
    let formattedCategories = [];
    try {
        AgentModel = AgentModel || await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();

        if (!agent.enableModelsPerCategory) {
            if (!agent.lastTraining) {
                return Promise.reject(GlobalDefaultError({
                    message: `The Agent id=[${agent.id}] is not trained`
                }));
            }
            const justER = agent.model.indexOf(RASA_MODEL_JUST_ER) !== -1;

            if (justER) {
                //Given that the agent only have one saying and is the model is just an ER, then we need the saying name
                const firstAgentCategoryId = AgentModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY)[0];
                const FirstAgentCategoryModel = await globalService.findById({ id: firstAgentCategoryId, model: MODEL_CATEGORY, returnModel: true });
                formattedCategories.push({ name: 'default', model: agent.model, justER, saying: await getFirstSayingName({ CategoryModel: FirstAgentCategoryModel }) });
            }
            else {
                formattedCategories.push({ name: 'default', model: agent.model, justER });
            }
        }

        else {
            const CategoryModels = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_CATEGORY, returnModel: true });
            if (CategoryModels.length === 0) {
                return Promise.reject(GlobalDefaultError({
                    message: `The Agent id=[${agent.id}] doesn't have any categories.`
                }));
            }
            const TrainedCategoryModels = CategoryModels.filter((CategoryModel) => CategoryModel.property('model'));

            if (TrainedCategoryModels.length === 0) {
                return Promise.reject(GlobalDefaultError({
                    message: `The Agent id=[${agent.id}] doesn't have any trained categories.`
                }));
            }

            formattedCategories = await Promise.all(TrainedCategoryModels.map(async (CategoryModel) => {

                const category = CategoryModel.allProperties();
                const justER = category.model.indexOf(RASA_MODEL_JUST_ER) !== -1;
                if (justER) {
                    return [{ name: category.categoryName, model: category.model, justER, saying: await getFirstSayingName({ CategoryModel }) }];
                }
                return { name: category.categoryName, model: category.model, justER };
            }));

            formattedCategories = _.flatten(formattedCategories);
        }

        if (agent.categoryRecognizer) {
            const name = agent.agentName + RASA_MODEL_CATEGORY_RECOGNIZER;
            formattedCategories.push({ name, model: name });
        }

        if (agent.modifiersRecognizer) {
            const name = agent.agentName + RASA_MODEL_MODIFIERS;
            formattedCategories.push({ name, model: name });
        }
        return formattedCategories;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
