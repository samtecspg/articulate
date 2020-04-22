import {
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_POST_FORMAT,
    MODEL_SAYING,
    MODEL_WEBHOOK
} from '../../../util/constants';
import NotFoundError from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

//const logger = require('../../../util/logger')({ name: `service:agent:export` });

const exportMap = (model) => model.export();
const returnModel = true;
const TYPE_WEBHOOK = 'webhook';
const TYPE_POST_FORMAT = 'postFormat';
const USE_WEBHOOK = 'useWebhook';
const USE_POST_FORMAT = 'usePostFormat';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    let exported = {};

    const loadWebhookOrPostFormat = async ({ parentModel, type }) => {

        const modelName = type === TYPE_WEBHOOK ? MODEL_WEBHOOK : MODEL_POST_FORMAT;
        const property = type === TYPE_WEBHOOK ? USE_WEBHOOK : USE_POST_FORMAT;
        if (!parentModel.property(property)) {
            return {};
        }
        const Model = await globalService.loadFirstLinked({ parentModel, model: modelName, returnModel });
        if (Model.isLoaded) {
            return { [type]: Model.export() };
        }
    };
    try {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        if (!AgentModel.isLoaded) {
            return Promise.reject(NotFoundError({ id, model: MODEL_AGENT }));
        }
        // [Agent]
        exported = AgentModel.export();

        // This is for compatibility with older agents
        if (exported.originalAgentVersionName === "") {
            exported.originalAgentVersionName = exported.agentName
        }
        if (exported.loadedAgentVersionName === "") {
            exported.loadedAgentVersionName = exported.agentName + '_v' + exported.currentAgentVersionCounter;
        }

        // [Agent] [Action]
        const ActionModels = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_ACTION, returnModel });
        exported = {
            ...exported, ...{
                actions: await Promise.all(ActionModels.map(async (ActionModel) => {

                    // [Agent] [Action] [Webhook]
                    const webhook = await loadWebhookOrPostFormat({ parentModel: ActionModel, type: TYPE_WEBHOOK });
                    // [Agent] [Action] [PostFormat]
                    const postFormat = await loadWebhookOrPostFormat({ parentModel: ActionModel, type: TYPE_POST_FORMAT });
                    return { ...ActionModel.export(), ...webhook, ...postFormat };
                }))
            }
        };

        // [Agent] [Category]
        const CategoryModels = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_CATEGORY, returnModel });
        exported = {
            ...exported, ...{
                categories: await Promise.all(CategoryModels.map(async (CategoryModel) => {
                    // [Agent] [Category] [Saying]
                    const CategorySayingModels = await globalService.loadAllLinked({ parentModel: CategoryModel, model: MODEL_SAYING, returnModel });
                    return { ...CategoryModel.export(), ...{ sayings: CategorySayingModels.map(exportMap) } };
                }))
            }
        };

        // [Agent] [Keyword]
        const KeywordModels = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_KEYWORD, returnModel });
        exported = { ...exported, ...{ keywords: KeywordModels.map(exportMap) } };

        // [Agent] [PostFormat]
        const webhook = await loadWebhookOrPostFormat({ parentModel: AgentModel, type: TYPE_WEBHOOK });

        // [Agent] [Webhook]
        const postFormat = await loadWebhookOrPostFormat({ parentModel: AgentModel, type: TYPE_POST_FORMAT });
        exported = { ...exported, ...webhook, ...postFormat };
        return exported;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
