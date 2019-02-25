import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE,
    MODEL_ACTION
} from '../../../util/constants';
import InvalidKeywordsFromAgent from '../../errors/global.invalid-keywords-from-agent';
import InvalidActionsFromAgent from '../../errors/global.invalid-actions-from-agent';
import RedisErrorHandler from '../../errors/redis.error-handler';

//const logger = require('../../../server/util/logger')({ name: `service:agent:update-saying-in-category` });

const filterById = ({ models, ids }) => {

    return _.filter(models, (model) => {
        return _.includes(ids, model.id);
    });
};

module.exports = async function (
    {
        id,
        categoryId,
        sayingId = null,
        sayingData,
        returnModel = false
    }) {

    const { redis } = this.server.app;
    const { globalService, categoryService, keywordService, actionService } = await this.server.services();
    try {

        const modelPath = [MODEL_AGENT, MODEL_CATEGORY];
        const modelPathIds = [id, categoryId, sayingId];
        if (sayingId) {
            modelPath.push(MODEL_SAYING);
            modelPathIds.push(sayingId);
        }

        // Load Used Models
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const CategoryModel = models[MODEL_CATEGORY];
        const SayingModel = models[MODEL_SAYING] || await redis.factory(MODEL_SAYING); //Empty model if we are going to do a create

        sayingData.keywords = _.sortBy(sayingData.keywords, (keyword) => keyword.start);

        // Create lists of keywords and actions to be used later
        let agentKeywordIds = await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD);
        let agentActionIds = await AgentModel.getAll(MODEL_ACTION, MODEL_ACTION);
        agentKeywordIds = agentKeywordIds.map((agentKeywordId) => parseInt(agentKeywordId));
        agentActionIds = agentActionIds.map((agentActionId) => agentActionId);
        const keywordIds = keywordService.splitAddedOldRemovedIds({
            oldKeywords: SayingModel.isLoaded ? _(SayingModel.property('keywords')) : [],
            newKeywords: sayingData.keywords
        });

        const AgentActionsModels = await globalService.loadAllByIds({
            ids: agentActionIds,
            model: MODEL_ACTION,
            returnModel: true
        });

        const actionIds = actionService.splitAddedOldRemovedIds({
            oldActions: SayingModel.isLoaded ? SayingModel.property('actions') : [],
            newActions: sayingData.actions,
            AgentActionsModels
        });

        const notValidActionIds = _.difference(actionIds.added, agentActionIds);
        if (notValidActionIds.length > 0) {
            return Promise.reject(InvalidActionsFromAgent({ actionIds: notValidActionIds, agentId: AgentModel.id }));
        }

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
        const newKeywordModels = filterById({ models: FilteredKeywordModels, ids: keywordIds.added });
        const removedKeywordModels = filterById({ models: FilteredKeywordModels, ids: keywordIds.removed });

        const newActionModels = filterById({ models: AgentActionsModels, ids: actionIds.added });
        const removedActionModels = filterById({ models: AgentActionsModels, ids: actionIds.removed });

        const parentModels = [
            AgentModel,
            CategoryModel,
            ...newKeywordModelsNonSystem,
            ...newActionModels
        ];
        if (SayingModel.isLoaded) { //Update
            // ADD Parent ---> Saying
            await SayingModel.updateInstance({
                data: sayingData,
                parentModels,
                removedParents: removedKeywordModels.concat(removedActionModels)
            });
            // ADD Category <---> UsedKeywords
            await categoryService.linkKeywords({ model: CategoryModel, keywordModels: newKeywordModels });
            // REMOVE Category <-/-> UnusedKeyword
            await categoryService.unlinkKeywords({ model: CategoryModel, keywordModels: removedKeywordModels });
        }
        else { // Create
            SayingModel.link(CategoryModel, MODEL_CATEGORY);
            // ADD Parent ---> Saying
            await SayingModel.createInstance({ data: sayingData, parentModels });
            // ADD Category <---> NewKeyword
            await categoryService.linkKeywords({ model: CategoryModel, keywordModels: newKeywordModels });
        }

        // Update status
        AgentModel.property('status', STATUS_OUT_OF_DATE);
        CategoryModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.saveInstance();
        await CategoryModel.saveInstance();

        return returnModel ? SayingModel : SayingModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
