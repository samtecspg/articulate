import _ from 'lodash';
import {
    MODEL_ACTION,
    MODEL_KEYWORD,
    STATUS_OUT_OF_DATE,
    MODEL_SAYING
} from '../../../util/constants';
import InvalidKeywordsFromAgent from '../../errors/global.invalid-keywords-from-agent';
import RedisErrorHandler from '../../errors/redis.error-handler';

const filterById = ({ models, ids }) => _.filter(models, (model) => _.includes(ids, model.id));

module.exports = async function ({ data, actionId, AgentModel = null, returnModel = false }) {

    const { redis } = this.server.app;
    const { globalService, keywordService } = await this.server.services();

    try {
        const ActionModel = await redis.factory(MODEL_ACTION, actionId);

        // Create lists of keywords to be used later
        const agentKeywordIds = await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD);
        const keywordIds = keywordService.splitAddedOldRemovedIds({
            oldKeywords: ActionModel.isLoaded ? _(ActionModel.property('slots')) : [],
            newKeywords: data.keywords
        });

        // Validate if the new keywords belongs to the current Agent
        const notValidIds = _.difference(keywordIds.addedNonSystem, agentKeywordIds);
        if (notValidIds.length > 0) {
            return Promise.reject(InvalidKeywordsFromAgent({ keywordIds: notValidIds, agentId: AgentModel.id }));
        }

        const FilteredKeywordModels = await globalService.loadAllByIds({
            ids: [...keywordIds.added, ...keywordIds.removed], //Only load the keywords we are going to use
            model: MODEL_KEYWORD,
            returnModel: true
        });

        const newKeywordModelsNonSystem = filterById({ models: FilteredKeywordModels, ids: keywordIds.addedNonSystem });
        const removedKeywordModels = filterById({ models: FilteredKeywordModels, ids: keywordIds.removed });

        const parentModels = [
            AgentModel,
            ...newKeywordModelsNonSystem
        ];

        if (ActionModel.isLoaded) { //Update
            if ((data.actionName !== undefined && ActionModel.property('actionName') !== data.actionName)){
                AgentModel.property('status', STATUS_OUT_OF_DATE);
            }

            // Create lists of keywords to be used later
            const actionSayingIds = await ActionModel.getAll(MODEL_SAYING, MODEL_SAYING);
            const ActionSayingsModels = await globalService.loadAllByIds({
                ids: actionSayingIds,
                model: MODEL_SAYING,
                returnModel: true
            });

            await AgentModel.saveInstance();
            const oldActionName = ActionModel.property('actionName');
            await ActionModel.updateInstance({
                data,
                parentModels,
                removedParents: removedKeywordModels
            });

            if (data.actionName && oldActionName !== data.actionName){
                ActionSayingsModels.forEach(async (ActionSayingModel) => {
                    
                    const actions = ActionSayingModel.property('actions');
                    actions[actions.indexOf(oldActionName)] = data.actionName;
                    await ActionSayingModel.updateInstance({
                        data: {
                            actions
                        }
                    });
                });
            }
        }
        else { // Create
            await ActionModel.createInstance({ data, parentModels });
        }

        return returnModel ? ActionModel : ActionModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
