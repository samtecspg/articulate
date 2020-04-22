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
    RASA_ENTITY_SYNONYMS,
    RASA_MODEL_CATEGORY_RECOGNIZER,
    RASA_MODEL_DEFAULT,
    RASA_MODEL_JUST_ER,
    RASA_MODEL_MODIFIERS,
    RASA_NLU_DATA,
    RASA_REGEX_FEATURES,
    STATUS_ERROR,
    STATUS_OUT_OF_DATE,
    STATUS_READY,
    STATUS_TRAINING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import InvalidAgentTrain from '../../errors/global.invalid-agent-train';

const generateTrainingDataForCategoriesRecognizer = async ({ AgentModel, CategoryModels, globalService, categoryService, enableModelsPerCategory }) => {

    let countOfCategoriesWithData = 0;
    let rasaNLUData = {
        [RASA_COMMON_EXAMPLES]: [],
        [RASA_REGEX_FEATURES]: [],
        [RASA_ENTITY_SYNONYMS]: []
    };

    if (enableModelsPerCategory) {
        for (let CategoryModel of CategoryModels) {

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
                rasaNLUData[RASA_ENTITY_SYNONYMS] = _.flatten([rasaNLUData[RASA_ENTITY_SYNONYMS], categoryTrainingData[RASA_NLU_DATA][RASA_ENTITY_SYNONYMS]]);
            }
        }
    }
    else {
        const keywords = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
        const sayings = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING), model: MODEL_SAYING });
        const trainingData = await categoryService.generateTrainingData({ keywords, sayings, extraTrainingData: AgentModel.property('extraTrainingData'), categoryName: 'default' });
        rasaNLUData = trainingData[RASA_NLU_DATA];
        countOfCategoriesWithData = trainingData[RASA_NLU_DATA][RASA_COMMON_EXAMPLES].length > 1 ? 1 : 0;
    }

    const allAgentKeywords = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
    const modifiersTrainingData = await categoryService.generateTrainingData({ keywords: allAgentKeywords, extraTrainingData: AgentModel.property('extraTrainingData'), categoryName: `${AgentModel.property('agentName')}_${RASA_MODEL_MODIFIERS}` });
    if (modifiersTrainingData[RASA_NLU_DATA][RASA_COMMON_EXAMPLES].length > 1) {
        countOfCategoriesWithData++;
        rasaNLUData[RASA_COMMON_EXAMPLES] = _.flatten([rasaNLUData[RASA_COMMON_EXAMPLES], modifiersTrainingData[RASA_NLU_DATA][RASA_COMMON_EXAMPLES]]);
        rasaNLUData[RASA_REGEX_FEATURES] = _.flatten([rasaNLUData[RASA_REGEX_FEATURES], modifiersTrainingData[RASA_NLU_DATA][RASA_REGEX_FEATURES]]);
        rasaNLUData[RASA_ENTITY_SYNONYMS] = _.flatten([rasaNLUData[RASA_ENTITY_SYNONYMS], modifiersTrainingData[RASA_NLU_DATA][RASA_ENTITY_SYNONYMS]]);
    }

    return {
        rasaNLUData,
        countOfCategoriesWithData
    };
};

module.exports = async function ({ id, returnModel = false }) {

    const { redis } = this.server.app;

    const { globalService, categoryService, rasaNLUService, serverService } = await this.server.services();

    let model = Guid.create().toString();
    try {
        const ServerModel = await serverService.get({ returnModel: true });
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();
        let markedAsTraining = false;
        //const rasaStatus = await rasaNLU.Status();

        const allAgentSayings = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING), model: MODEL_SAYING });
        const sayingsWithoutActions = allAgentSayings.filter((agentSaying) => {

            return agentSaying.actions.length === 0;
        });

        if (!agent.settings.rasaURLs || agent.settings.rasaURLs.length === 0) {
            throw new Error('There is no URL specified for RASA');
        }

        if (sayingsWithoutActions.length > 0) {
            return Promise.reject(InvalidAgentTrain({ message: `The following user sayings doesn't have actions asigned: "${_.map(sayingsWithoutActions, 'userSays').join('", "')}"` }));
        }

        const CategoryModels = await globalService.loadAllByIds({
            ids: await AgentModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY),
            model: MODEL_CATEGORY,
            returnModel: true
        });

        //Train category identifier (If enableModelsPerCategory is false will train a category recognizer between default model and modifiers)
        if ((agent.enableModelsPerCategory && CategoryModels.length > 1) || (!agent.enableModelsPerCategory && CategoryModels.length > 0)) {
            const categoriesTrainingData = await generateTrainingDataForCategoriesRecognizer({ AgentModel, CategoryModels, globalService, categoryService, enableModelsPerCategory: agent.enableModelsPerCategory });

            if (categoriesTrainingData.countOfCategoriesWithData > 1) {
                const pipeline = agent.settings[CONFIG_SETTINGS_CATEGORY_PIPELINE];
                const categoryRecognizerModel = `${agent.agentName}${RASA_MODEL_CATEGORY_RECOGNIZER}`;
                AgentModel.property('status', STATUS_TRAINING);
                await AgentModel.saveInstance();
                ServerModel.property('status', STATUS_TRAINING);
                await ServerModel.saveInstance();
                markedAsTraining = true;
                var urls = agent.settings.rasaURLs;
                await Promise.all(_.map(urls, async (url) => {
                    await rasaNLUService.train({
                        project: agent.agentName,
                        model: categoryRecognizerModel,
                        oldModel: categoryRecognizerModel,
                        trainingSet: {
                            [RASA_NLU_DATA]: categoriesTrainingData.rasaNLUData
                        },
                        pipeline,
                        language: agent.language,
                        baseURL: url/*agent.settings[CONFIG_SETTINGS_RASA_URL]*/
                    });
                }));
                AgentModel.property('categoryRecognizer', true);
            }
            else {
                AgentModel.property('categoryRecognizer', false);
            }
        }

        if (agent.enableModelsPerCategory) {

            //const trainingLimit = rasaStatus[RASA_MAX_TRAINING_PROCESSES] - rasaStatus[RASA_CURRENT_TRAINING_PROCESSES];
            const CategoryModelsToTrain = CategoryModels.filter((CategoryModel) => {

                const status = CategoryModel.property('status');
                return status === STATUS_OUT_OF_DATE || status === STATUS_ERROR;
            });

            //Train each category that need it
            if (CategoryModelsToTrain.length > 0) {
                //TODO: Do it in Parallel
                for (let CategoryModel of CategoryModels) {
                    const status = CategoryModel.property('status');
                    if (status === STATUS_ERROR || status === STATUS_OUT_OF_DATE) {
                        if (!markedAsTraining) {
                            AgentModel.property('status', STATUS_TRAINING);
                            await AgentModel.saveInstance();
                            ServerModel.property('status', STATUS_TRAINING);
                            await ServerModel.saveInstance();
                            markedAsTraining = true;
                        }
                        await categoryService.train({ AgentModel, CategoryModel });
                    }
                }
            }
        }
        else {
            //Train default model
            const keywords = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
            const trainingData = await categoryService.generateTrainingData({ keywords, sayings: allAgentSayings, extraTrainingData: agent.extraTrainingData });
            if (trainingData.numberOfSayings === 0) {
                return Promise.reject(InvalidAgentTrain({ agent: AgentModel.property('agentName') }));
            }
            const pipeline = trainingData.numberOfSayings === 1 ? agent.settings[CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[CONFIG_SETTINGS_SAYING_PIPELINE];
            model = (trainingData.numberOfSayings === 1 ? RASA_MODEL_JUST_ER : '') + model;
            model = `${RASA_MODEL_DEFAULT}${model}`;
            if (!markedAsTraining) {
                AgentModel.property('status', STATUS_TRAINING);
                await AgentModel.saveInstance();
                ServerModel.property('status', STATUS_TRAINING);
                await ServerModel.saveInstance();
                markedAsTraining = true;
            }

            var urls = agent.settings.rasaURLs;
            await Promise.all(_.map(urls, async (url) => {
                return await rasaNLUService.train({
                    project: agent.agentName,
                    model,
                    oldModel: agent.model || null,
                    trainingSet: {
                        [RASA_NLU_DATA]: trainingData[RASA_NLU_DATA]
                    },
                    pipeline,
                    language: agent.language,
                    baseURL: url //agent.settings[CONFIG_SETTINGS_RASA_URL]
                });
            }));
        }

        //train modifiers model
        const rasaNLUData = {
            [RASA_COMMON_EXAMPLES]: [],
            [RASA_REGEX_FEATURES]: [],
            [RASA_ENTITY_SYNONYMS]: []
        };

        const keywords = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
        const modifiersTrainingData = await categoryService.generateTrainingData({ keywords, extraTrainingData: agent.extraTrainingData });
        rasaNLUData[RASA_COMMON_EXAMPLES] = _.flatten([rasaNLUData[RASA_COMMON_EXAMPLES], modifiersTrainingData[RASA_NLU_DATA][RASA_COMMON_EXAMPLES]]);
        rasaNLUData[RASA_REGEX_FEATURES] = _.flatten([rasaNLUData[RASA_REGEX_FEATURES], modifiersTrainingData[RASA_NLU_DATA][RASA_REGEX_FEATURES]]);
        rasaNLUData[RASA_ENTITY_SYNONYMS] = _.flatten([rasaNLUData[RASA_ENTITY_SYNONYMS], modifiersTrainingData[RASA_NLU_DATA][RASA_ENTITY_SYNONYMS]]);

        if (modifiersTrainingData.numberOfSayings > 0) {
            const pipeline = modifiersTrainingData.numberOfSayings === 1 ? agent.settings[CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[CONFIG_SETTINGS_SAYING_PIPELINE];
            const modifiersRecognizerModel = `${agent.agentName}_${modifiersTrainingData.numberOfSayings === 1 ? `${RASA_MODEL_JUST_ER}` : ''}${RASA_MODEL_MODIFIERS}`;
            if (!markedAsTraining) {
                AgentModel.property('status', STATUS_TRAINING);
                await AgentModel.saveInstance();
                ServerModel.property('status', STATUS_TRAINING);
                await ServerModel.saveInstance();
                markedAsTraining = true;
            }
            var urls = agent.settings.rasaURLs;
            await Promise.all(_.map(urls, async (url) => {
                await rasaNLUService.train({
                    project: agent.agentName,
                    model: modifiersRecognizerModel,
                    oldModel: `${agent.agentName}_${agent.modifiersRecognizerJustER ? `${RASA_MODEL_JUST_ER}` : ''}${RASA_MODEL_MODIFIERS}`,
                    trainingSet: {
                        [RASA_NLU_DATA]: rasaNLUData
                    },
                    pipeline,
                    language: agent.language,
                    baseURL: url/*agent.settings[CONFIG_SETTINGS_RASA_URL]*/
                });
            }));
            AgentModel.property('modifiersRecognizer', true);
        }
        else {
            AgentModel.property('modifiersRecognizer', false);
        }
        //If there is just one modifier set the modifiersRecognizerJustER attribute of the agent with the name of that modifier
        AgentModel.property('modifiersRecognizerJustER', modifiersTrainingData.numberOfSayings === 1 ? rasaNLUData[RASA_COMMON_EXAMPLES][0].intent : '');

        AgentModel.property('model', model);
        /*
            Only change the status to ready if the status is still training, because if not we are going to mark
            an agent as ready when actually it could be out of date because user edited while it was being trained
        */

        if (markedAsTraining) {
            const CurrentAgentModel = await redis.factory(MODEL_AGENT, id);
            const currentAgent = CurrentAgentModel.allProperties();
            if (currentAgent.status === STATUS_TRAINING) {
                AgentModel.property('lastTraining', Moment().utc().format());
                AgentModel.property('status', STATUS_READY);
                ServerModel.property('status', STATUS_READY);
            }
            await AgentModel.saveInstance();
            await ServerModel.saveInstance();
            return returnModel ? AgentModel : AgentModel.allProperties();
        }
        return Promise.reject(InvalidAgentTrain({ agent: agent.agentName }));
    }
    catch (error) {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        AgentModel.property('status', STATUS_ERROR);
        await AgentModel.saveInstance();
        const ServerModel = await serverService.get({ returnModel: true });
        ServerModel.property('status', STATUS_READY);
        await ServerModel.saveInstance();
        throw RedisErrorHandler({ error });
    }
};
