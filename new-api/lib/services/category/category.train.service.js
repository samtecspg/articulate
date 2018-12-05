import Guid from 'guid';
import Moment from 'moment';
import {
    CONFIG_SETTINGS_KEYWORD_PIPELINE,
    CONFIG_SETTINGS_RASA_URL,
    CONFIG_SETTINGS_SAYING_PIPELINE,
    MODEL_KEYWORD,
    MODEL_SAYING,
    RASA_MODEL_JUST_ER,
    RASA_NLU_DATA,
    STATUS_ERROR,
    STATUS_READY,
    STATUS_TRAINING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ AgentModel, CategoryModel, returnModel = false }) {

    const agent = AgentModel.allProperties();
    const category = CategoryModel.allProperties();
    const { categoryService, globalService, rasaNLUService } = await this.server.services();
    let model = Guid.create().toString();
    try {
        const keywords = await globalService.loadAllByIds({ ids: await CategoryModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
        const sayings = await globalService.loadAllByIds({ ids: await CategoryModel.getAll(MODEL_SAYING, MODEL_SAYING), model: MODEL_SAYING });
        const trainingData = await categoryService.generateTrainingData({ keywords, sayings, extraTrainingData: category.extraTrainingData });

        const pipeline = trainingData.numberOfSayings === 1 ? agent.settings[CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[CONFIG_SETTINGS_SAYING_PIPELINE];
        model = (trainingData.numberOfSayings === 1 ? RASA_MODEL_JUST_ER : '') + model;
        model = category.categoryName + '_' + model;

        CategoryModel.property('status', STATUS_TRAINING);
        await CategoryModel.save();

        await rasaNLUService.train({
            project: agent.agentName,
            model,
            oldModel: category.model || null,
            trainingSet: {
                [RASA_NLU_DATA]: trainingData[RASA_NLU_DATA]
            },
            pipeline,
            language: agent.language,
            baseURL: agent.settings[CONFIG_SETTINGS_RASA_URL]
        });
        CategoryModel.property('lastTraining', Moment().utc().format());
        CategoryModel.property('model', model);
        CategoryModel.property('status', STATUS_READY);

        await CategoryModel.save();
        return returnModel ? CategoryModel : CategoryModel.allProperties();
    }
    catch (error) {
        CategoryModel.property('status', STATUS_ERROR);
        await CategoryModel.save();
        throw RedisErrorHandler({ error });
    }
};
