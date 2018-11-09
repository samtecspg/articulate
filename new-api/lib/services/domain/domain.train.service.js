import Guid from 'guid';
import Moment from 'moment';
import {
    CONFIG_SETTINGS_KEYWORD_PIPELINE,
    CONFIG_SETTINGS_RASA_URL,
    CONFIG_SETTINGS_SAYING_PIPELINE,
    MODEL_KEYWORD,
    MODEL_SAYING,
    RASA_MODEL_JUST_ER,
    STATUS_ERROR,
    STATUS_READY,
    STATUS_TRAINING,
    RASA_NLU_DATA
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ AgentModel, DomainModel, returnModel = false }) {

    const agent = AgentModel.allProperties();
    const domain = DomainModel.allProperties();
    const { domainService, globalService, rasaNLUService } = await this.server.services();
    let model = Guid.create().toString();
    try {
        const keywords = await globalService.loadAllByIds({ ids: await DomainModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
        const sayings = await globalService.loadAllByIds({ ids: await DomainModel.getAll(MODEL_SAYING, MODEL_SAYING), model: MODEL_SAYING  });
        const trainingData = await domainService.generateTrainingData({ keywords, sayings, extraTrainingData: domain.extraTrainingData });
        if (trainingData.numberOfSayings === 0) {
            return;
        }
        const pipeline = trainingData.numberOfSayings === 1 ? agent.settings[CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[CONFIG_SETTINGS_SAYING_PIPELINE];
        model = (trainingData.numberOfSayings === 1 ? RASA_MODEL_JUST_ER : '') + model;
        model = domain.domainName + '_' + model;

        DomainModel.property('status', STATUS_TRAINING);
        await DomainModel.save();
        
        await rasaNLUService.train({
            project: agent.agentName,
            model,
            oldModel: domain.model || null,
            trainingSet: {
                [RASA_NLU_DATA]: trainingData[RASA_NLU_DATA]
            },
            pipeline,
            language: agent.language,
            baseURL: agent.settings[CONFIG_SETTINGS_RASA_URL]
        });
        DomainModel.property('lastTraining', Moment().utc().format());
        DomainModel.property('model', model);
        DomainModel.property('status', STATUS_READY);
        await DomainModel.save();
        return returnModel ? DomainModel : DomainModel.allProperties();
    }
    catch (error) {
        DomainModel.property('status', STATUS_ERROR);
        await DomainModel.save();
        throw RedisErrorHandler({ error });
    }
};
