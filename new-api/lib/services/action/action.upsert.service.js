import _ from 'lodash';
import {
    MODEL_ACTION,
    MODEL_KEYWORD
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
            await ActionModel.updateInstance({
                data,
                parentModels,
                removedParents: removedKeywordModels
            });

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
