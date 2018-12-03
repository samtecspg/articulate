import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import InvalidKeywordsFromAgent from '../../errors/global.invalid-keywords-from-agent';
import RedisErrorHandler from '../../errors/redis.error-handler';

//const logger = require('../../../util/logger')({ name: `service:agent:update-saying-in-category` });

const filterById = ({ models, ids }) => _.filter(models, (model) => _.includes(ids, model.id));
//TODO: Review if the actions array needs to be linked to the Actions
module.exports = async function (
    {
        id,
        categoryId,
        sayingId = null,
        sayingData,
        returnModel = false
    }) {

    const { redis } = this.server.app;
    const { globalService, categoryService, keywordService } = await this.server.services();
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

        // Create lists of keywords to be used later
        let agentKeywordIds = await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD);
        agentKeywordIds = agentKeywordIds.map((agentKeywordId) => parseInt(agentKeywordId));
        const keywordIds = keywordService.splitAddedOldRemovedIds({
            oldKeywords: SayingModel.isLoaded ? _(SayingModel.property('keywords')) : [],
            newKeywords: sayingData.keywords
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
        const newKeywordModels = filterById({ models: FilteredKeywordModels, ids: keywordIds.added });
        const removedKeywordModels = filterById({ models: FilteredKeywordModels, ids: keywordIds.removed });

        const parentModels = [
            AgentModel,
            CategoryModel,
            ...newKeywordModelsNonSystem
        ];
        if (SayingModel.isLoaded) { //Update
            // ADD Parent ---> Saying
            await SayingModel.updateInstance({
                data: sayingData,
                parentModels,
                removedParents: removedKeywordModels
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
        await AgentModel.save();
        await CategoryModel.save();

        return returnModel ? SayingModel : SayingModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
