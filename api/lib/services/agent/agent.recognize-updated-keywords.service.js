import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_KEYWORD,
    MODEL_SAYING,
    MODEL_CATEGORY
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, payload }) {

    const { globalService, agentService } = await this.server.services();
    const modelPath = [MODEL_AGENT];
    const modelPathIds = [id];
    const { deletedValues, updatedValues } = payload;
    try {

        const groupedUpdatedArray = groupUpdateArray(updatedValues);
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];

        //Sayings
        const sayingsIds = await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING);

        const allSayings = await
            globalService.loadAllByIds({
                ids: sayingsIds,
                model: MODEL_SAYING,
                returnModel: true
            });

        await Promise.all(allSayings.map(async function (saying) {
            var category = await globalService.loadAllLinked({ parentModel: saying, model: MODEL_CATEGORY, returnModel: true });
            var currentKeywords = saying.property('keywords');
            currentKeywords = await removeKeywords(deletedValues, currentKeywords);

            let identifiedKeywords;
            if (groupedUpdatedArray.length > 0) {
                identifiedKeywords = await agentService.identifyKeywords({ id: AgentModel.id, AgentModel, text: saying.properties.get('userSays').value, customValues: groupedUpdatedArray });
                currentKeywords = await mergeKeywordsLists(identifiedKeywords, currentKeywords);
            }

            let sayingData = saying.allProperties();
            sayingData.keywords = currentKeywords;
            delete sayingData.id;
            await agentService.upsertSayingInCategory({
                id: Number(AgentModel.id),
                categoryId: Number(category[0].id),
                sayingId: Number(saying.id),
                sayingData: sayingData
            });

        }));

        let uniqueKeywordIds = await getUniqueKeywordIds(deletedValues, updatedValues);

        //Modifiers
        await Promise.all(_.map(uniqueKeywordIds, async function (keywordId) {
            const modelPath = [MODEL_KEYWORD];
            const modelPathIds = [keywordId];
            const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
            const KeywordModel = models[MODEL_KEYWORD];
            const keywordData = KeywordModel.allPropertiesCache;

            await Promise.all(_.map(keywordData.modifiers, async function (modifier) {
                await Promise.all(_.map(modifier.sayings, async function (saying) {
                    var currentKeywords = saying.keywords;
                    currentKeywords = await removeKeywords(deletedValues, currentKeywords);

                    let identifiedKeywords;
                    if (groupedUpdatedArray.length > 0) {
                        identifiedKeywords = await agentService.identifyKeywords({ id: AgentModel.id, AgentModel, text: saying.userSays, customValues: groupedUpdatedArray });
                        currentKeywords = await mergeKeywordsLists(identifiedKeywords, currentKeywords);
                    }
                    saying.keywords = currentKeywords;
                }));
            }));

            delete keywordData.id
            agentService.updateKeyword({
                id: Number(AgentModel.id),
                keywordId: KeywordModel.id,
                keywordData
            });
        }));

        return { message: 'Sayings and modifiers updated' };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};

var groupUpdateArray = function (updateArray) {
    var result = _.chain(updateArray).groupBy("keywordId").map(function (v, i) {
        return {
            id: i,
            keywordName: _.get(_.find(v, 'keywordName'), 'keywordName'),
            synonyms: _.map(v, 'synonym')
        }
    }).value();
    return result;
}

var removeKeywords = async function (deletedValues, currentKeywords) {
    return currentKeywords.filter(keyword => {
        return !deletedValues.find(function (deletedValue) {
            return keyword.keywordId === deletedValue.keywordId &&
                keyword.value === deletedValue.synonym
        })
    })
}

var mergeKeywordsLists = async function (identifiedKeywords, existingKeywords) {
    var result = identifiedKeywords.filter(identifiedKeyword => {
        return !existingKeywords.find(function (existingKeyword) {
            return (identifiedKeyword.start >= existingKeyword.start &&
                identifiedKeyword.start <= existingKeyword.end) ||
                (identifiedKeyword.end >= existingKeyword.start &&
                    identifiedKeyword.end <= existingKeyword.end) ||
                (identifiedKeyword.start <= existingKeyword.start &&
                    identifiedKeyword.end >= existingKeyword.end) ||
                (identifiedKeyword.start >= existingKeyword.start &&
                    identifiedKeyword.end <= existingKeyword.end)
        })
    }).concat(existingKeywords);
    return result;
}

var getUniqueKeywordIds = async function (deletedValues, updatedValues) {
    let deletedKeywordIds = deletedValues.map(value => {
        return value.keywordId
    });
    let updatedKeywordIds = updatedValues.map(value => {
        return value.keywordId
    });
    let result = deletedKeywordIds.concat(updatedKeywordIds);
    return result.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}