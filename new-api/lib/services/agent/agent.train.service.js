import Guid from 'guid';
import _ from 'lodash';
import Moment from 'moment';
import {
    CONFIG_SETTINGS_DOMAIN_PIPELINE,
    CONFIG_SETTINGS_KEYWORD_PIPELINE,
    CONFIG_SETTINGS_RASA_URL,
    CONFIG_SETTINGS_SAYING_PIPELINE,
    MODEL_AGENT,
    MODEL_DOMAIN,
    MODEL_KEYWORD,
    MODEL_SAYING,
    RASA_COMMON_EXAMPLES,
    RASA_KEYWORD_SYNONYMS,
    RASA_MODEL_DEFAULT,
    RASA_MODEL_DOMAIN_RECOGNIZER,
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

    const { globalService, domainService, rasaNLUService } = await this.server.services();
    let model = Guid.create().toString();
    try {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();
        //const rasaStatus = await rasaNLU.Status();
        AgentModel.property('status', STATUS_TRAINING);
        await AgentModel.save();
        //TODO: Publish agent update
        if (agent.enableModelsPerDomain) {
            const DomainModels = await globalService.loadAllByIds({ 
                ids: await AgentModel.getAll(MODEL_DOMAIN, MODEL_DOMAIN),
                model: MODEL_DOMAIN,
                returnModel: true 
            });
            //const trainingLimit = rasaStatus[RASA_MAX_TRAINING_PROCESSES] - rasaStatus[RASA_CURRENT_TRAINING_PROCESSES];
            const DomainModelsToTrain = DomainModels.filter((DomainModel) => {

                const status = DomainModel.property('status');
                return status === STATUS_OUT_OF_DATE || status === STATUS_ERROR;
            });

            //Train domain identifier
            if (DomainModels.length > 1) {
                const rasaNLUData = {
                    [RASA_COMMON_EXAMPLES]: [],
                    [RASA_REGEX_FEATURES]: [],
                    [RASA_KEYWORD_SYNONYMS]: []
                };

                await Promise.all(DomainModels.forEach(async (DomainModel) => {

                    const sayingIds = await DomainModel.getAll(MODEL_SAYING);
                    if (sayingIds.length === 0) {
                        return;
                    }
                    const extraTrainingData = DomainModel.property('extraTrainingData');
                    const keywords = await globalService.loadAllByIds({ ids: await DomainModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
                    const sayings = await globalService.loadAllByIds({ ids: await DomainModel.getAll(MODEL_SAYING, MODEL_SAYING), model: MODEL_SAYING });
                    const domainTrainingData = await domainService.generateTrainingData({ keywords, sayings, extraTrainingData });
                    rasaNLUData[RASA_COMMON_EXAMPLES] = _.flatten([rasaNLUData[RASA_COMMON_EXAMPLES], domainTrainingData[RASA_NLU_DATA][RASA_COMMON_EXAMPLES]]);
                    rasaNLUData[RASA_REGEX_FEATURES] = _.flatten([rasaNLUData[RASA_REGEX_FEATURES], domainTrainingData[RASA_NLU_DATA][RASA_REGEX_FEATURES]]);
                    rasaNLUData[RASA_KEYWORD_SYNONYMS] = _.flatten([rasaNLUData[RASA_KEYWORD_SYNONYMS], domainTrainingData[RASA_NLU_DATA][RASA_KEYWORD_SYNONYMS]]);

                }));
                const pipeline = agent.settings[CONFIG_SETTINGS_DOMAIN_PIPELINE];
                const domainRecognizerModel = `${agent.agentName}${RASA_MODEL_DOMAIN_RECOGNIZER}`;
                await rasaNLUService.train({
                    project: agent.agentName,
                    model: domainRecognizerModel,
                    oldModel: domainRecognizerModel,
                    trainingSet: {
                        [RASA_NLU_DATA]: rasaNLUData
                    },
                    pipeline,
                    language: agent.language,
                    baseURL: agent.settings[CONFIG_SETTINGS_RASA_URL]
                });
                AgentModel.property('domainRecognizer', true);
            }

            //Train each domain that need it
            if (!(!DomainModelsToTrain.length > 0 && DomainModels.length < 2)) {
                //TODO: Do in parallel
                await Promise.all(DomainModels.map(async (DomainModel) => {

                    const status = DomainModel.property('status');
                    if (status === STATUS_TRAINING || status === STATUS_READY) {
                        return;
                    }
                    await domainService.train({ AgentModel, DomainModel });
                }));
            }

        }
        else {
            //Train default model
            const keywords = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD) });
            const sayings = await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_SAYING, MODEL_SAYING) });
            const trainingData = domainService.generateTrainingData({ keywords, sayings, extraTrainingData: agent.extraTrainingData, isKeyword: false });
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
                    [RASA_NLU_DATA]: trainingSet[RASA_NLU_DATA]
                },
                pipeline,
                language: agent.language,
                baseURL: agent.settings[CONFIG_SETTINGS_RASA_URL]
            });
        }

        AgentModel.property('domainRecognizer', true);
        AgentModel.property('lastTraining', Moment().utc().format());
        AgentModel.property('model', model);
        AgentModel.property('status', STATUS_READY);
        await AgentModel.save();
        return returnModel ? AgentModel : AgentModel.allProperties();
    }
    catch (error) {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        AgentModel.property('status', STATUS_ERROR);
        await AgentModel.save();
        throw RedisErrorHandler({ error });
    }
};
