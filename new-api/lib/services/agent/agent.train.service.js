import Guid from 'guid';
import _ from 'lodash';
import Moment from 'moment';
import {
    CONFIG_SETTINGS_CATEGORY_PIPELINE,
    CONFIG_SETTINGS_KEYWORD_PIPELINE,
    CONFIG_SETTINGS_RASA_URL,
    CONFIG_SETTINGS_SAYING_PIPELINE,
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_SAYING,
    RASA_COMMON_EXAMPLES,
    RASA_KEYWORD_SYNONYMS,
    RASA_MODEL_DEFAULT,
    RASA_MODEL_CATEGORY_RECOGNIZER,
    RASA_MODEL_JUST_ER,
    RASA_NLU_DATA,
    RASA_REGEX_FEATURES,
    STATUS_ERROR,
    STATUS_OUT_OF_DATE,
    STATUS_READY,
    STATUS_TRAINING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, returnModel = false }) {

    const { redis/*, [`rasa-nlu`]: rasaNLU*/ } = this.server.app;

    const { globalService, categoryService, rasaNLUService } = await this.server.services();
    let model = Guid.create().toString();
    try {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();
        //const rasaStatus = await rasaNLU.Status();
        AgentModel.property('status', STATUS_TRAINING);
        await AgentModel.saveInstance();
        if (agent.enableModelsPerCategory) {
            const CategoryModels = await globalService.loadAllByIds({
                ids: await AgentModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY),
                model: MODEL_CATEGORY,
                returnModel: true
            });
            //const trainingLimit = rasaStatus[RASA_MAX_TRAINING_PROCESSES] - rasaStatus[RASA_CURRENT_TRAINING_PROCESSES];
            const CategoryModelsToTrain = CategoryModels.filter((CategoryModel) => {

                const status = CategoryModel.property('status');
                return status === STATUS_OUT_OF_DATE || status === STATUS_ERROR;
            });

            //Train category identifier
            if (CategoryModels.length > 1) {
                let countOfCategoriesWithData = 0;
                const rasaNLUData = {
                    [RASA_COMMON_EXAMPLES]: [],
                    [RASA_REGEX_FEATURES]: [],
                    [RASA_KEYWORD_SYNONYMS]: []
                };

                for (const CategoryModel of CategoryModels) {

                    const sayingIds = await CategoryModel.getAll(MODEL_SAYING, MODEL_SAYING);
                    if (sayingIds.length > 1) { // If the category only have 1 saying then RASA will fail during training
                        countOfCategoriesWithData++;
                        const categoryName = CategoryModel.property('categoryName');
                        const extraTrainingData = CategoryModel.property('extraTrainingData');
                        const keywords = await globalService.loadAllByIds({ ids: await CategoryModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
                        const sayings = await globalService.loadAllByIds({ ids: await CategoryModel.getAll(MODEL_SAYING, MODEL_SAYING), model: MODEL_SAYING });
                        const categoryTrainingData = await categoryService.generateTrainingData({ keywords, sayings, extraTrainingData, categoryName });
                        rasaNLUData[RASA_COMMON_EXAMPLES] = _.flatten([rasaNLUData[RASA_COMMON_EXAMPLES], categoryTrainingData[RASA_NLU_DATA][RASA_COMMON_EXAMPLES]]);
                        rasaNLUData[RASA_REGEX_FEATURES] = _.flatten([rasaNLUData[RASA_REGEX_FEATURES], categoryTrainingData[RASA_NLU_DATA][RASA_REGEX_FEATURES]]);
                        rasaNLUData[RASA_KEYWORD_SYNONYMS] = _.flatten([rasaNLUData[RASA_KEYWORD_SYNONYMS], categoryTrainingData[RASA_NLU_DATA][RASA_KEYWORD_SYNONYMS]]);
                    }
                }
                if (countOfCategoriesWithData > 1) {
                    const pipeline = agent.settings[CONFIG_SETTINGS_CATEGORY_PIPELINE];
                    const categoryRecognizerModel = `${agent.agentName}${RASA_MODEL_CATEGORY_RECOGNIZER}`;
                    await rasaNLUService.train({
                        project: agent.agentName,
                        model: categoryRecognizerModel,
                        oldModel: categoryRecognizerModel,
                        trainingSet: {
                            [RASA_NLU_DATA]: rasaNLUData
                        },
                        pipeline,
                        language: agent.language,
                        baseURL: agent.settings[CONFIG_SETTINGS_RASA_URL]
                    });
                    AgentModel.property('categoryRecognizer', true);
                }
            }

            //Train each category that need it
            if (!(!CategoryModelsToTrain.length > 0 && CategoryModels.length < 2)) {
                //TODO: Do in parallel
                await Promise.all(CategoryModels.map(async (CategoryModel) => {

                    const status = CategoryModel.property('status');
                    if (status === STATUS_TRAINING || status === STATUS_READY) {
                        return;
                    }
                    await categoryService.train({ AgentModel, CategoryModel });
                }));
            }

        }
        else {
            //Train default model
            const keywords = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
            const sayings = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING), model: MODEL_SAYING });
            const trainingData = await categoryService.generateTrainingData({ keywords, sayings, extraTrainingData: agent.extraTrainingData, isKeyword: false });
            if (trainingData.numberOfSayings === 0) {
                return;
            }
            const pipeline = trainingData.numberOfSayings === 1 ? agent.settings[CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[CONFIG_SETTINGS_SAYING_PIPELINE];
            model = (trainingData.numberOfSayings === 1 ? RASA_MODEL_JUST_ER : '') + model;
            model = `${RASA_MODEL_DEFAULT}${model}`;
            await rasaNLUService.train({
                project: agent.agentName,
                model,
                oldModel: agent.model || null,
                trainingSet: {
                    [RASA_NLU_DATA]: trainingData[RASA_NLU_DATA]
                },
                pipeline,
                language: agent.language,
                baseURL: agent.settings[CONFIG_SETTINGS_RASA_URL]
            });
            AgentModel.property('categoryRecognizer', false);
        }
        
        AgentModel.property('lastTraining', Moment().utc().format());
        AgentModel.property('model', model);
        AgentModel.property('status', STATUS_READY);
        await AgentModel.saveInstance();
        return returnModel ? AgentModel : AgentModel.allProperties();
    }
    catch (error) {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        AgentModel.property('status', STATUS_ERROR);
        await AgentModel.saveInstance();
        throw RedisErrorHandler({ error });
    }
};
