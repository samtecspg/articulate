import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

const validateExamplesAreEqual = ({ prevExamples, newExamples }) => {

    const prevExampleValues = _.map(prevExamples, 'value').sort();
    const newExampleValues = _.map(newExamples, 'value').sort();
    if (!_.isEqual(prevExampleValues, newExampleValues)) {
        return true;
    }
    return newExamples.some((newExample) => {

        const currentExistingExample = prevExamples.find((prevExample) => newExample.value === prevExample.value);
        return !_.isEqual(newExample.synonyms.sort(), currentExistingExample.synonyms.sort());
    });

};
module.exports = async function ({ id, keywordId, keywordData, returnModel = false }) {

    const { globalService } = await this.server.services();
    try {
        const modelPath = [MODEL_AGENT, MODEL_KEYWORD];
        const modelPathIds = [id, keywordId];

        // Load Used Models
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const KeywordModel = models[MODEL_KEYWORD];
        const requiresRetrain = validateExamplesAreEqual({ prevExamples: KeywordModel.property('examples'), newExamples: keywordData.examples });
        await KeywordModel.updateInstance({ data: keywordData });

        if (requiresRetrain) {
            // Update Agent and related categories status
            // TODO: Publish Agent update
            AgentModel.property('status', STATUS_OUT_OF_DATE);
            await AgentModel.save();

            const keywordCategoryIds = await KeywordModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY);
            const KeywordCategoryModels = await globalService.loadAllByIds({
                ids: keywordCategoryIds, //Only load the keywords we are going to use
                model: MODEL_CATEGORY,
                returnModel: true
            });

            const categoryStatusUpdatePromise = KeywordCategoryModels.map(async (CategoryModel) => {

                CategoryModel.property('status', STATUS_OUT_OF_DATE);
                return await CategoryModel.save();
            });
            await Promise.all(categoryStatusUpdatePromise);
        }
        return returnModel ? KeywordModel : KeywordModel.allProperties();

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
