import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_DOMAIN,
    MODEL_SAYING,
    RASA_MODEL_DOMAIN_RECOGNIZER,
    RASA_MODEL_JUST_ER
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id = null, AgentModel = null }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    const getFirstSayingName = async ({ DomainModel }) => {

        const domainSayingsIds = await DomainModel.getAll(MODEL_SAYING, MODEL_SAYING);
        const firstDomainSayingId = domainSayingsIds[0];
        const firstDomainSaying = await globalService.findById({ id: firstDomainSayingId, model: MODEL_SAYING });
        return firstDomainSaying.actions.join('+');
    };
    let formattedDomains = [];
    try {
        AgentModel = AgentModel || await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();

        if (!agent.enableModelsPerDomain) {
            if (!agent.lastTraining) {
                return Promise.reject(GlobalDefaultError({
                    message: `The Agent id=[${agent.id}] is not trained`
                }));
            }
            const justER = agent.model.indexOf(RASA_MODEL_JUST_ER) !== -1;

            if (justER) {
                //Given that the agent only have one saying and is the model is just an ER, then we need the saying name
                const firstAgentDomainId = AgentModel.getAll(MODEL_DOMAIN, MODEL_DOMAIN)[0];
                const FirstAgentDomainModel = await globalService.findById({ id: firstAgentDomainId, model: MODEL_DOMAIN, returnModel: true });
                formattedDomains.push({ name: 'default', model: agent.model, justER, saying: await getFirstSayingName({ DomainModel: FirstAgentDomainModel }) });
            }
            else {
                formattedDomains.push({ name: 'default', model: agent.model, justER });
            }
        }

        else {
            const DomainModels = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_DOMAIN, returnModel: true });
            if (DomainModels.length === 0) {
                return Promise.reject(GlobalDefaultError({
                    message: `The Agent id=[${agent.id}] doesn't have any domains.`
                }));
            }
            const TrainedDomainModels = DomainModels.filter((DomainModel) => DomainModel.property('lastTraining'));

            if (TrainedDomainModels.length === 0) {
                return Promise.reject(GlobalDefaultError({
                    message: `The Agent id=[${agent.id}] doesn't have any trained domains.`
                }));
            }

            formattedDomains = await Promise.all(TrainedDomainModels.map(async (DomainModel) => {

                const domain = DomainModel.allProperties();
                const justER = domain.model.indexOf(RASA_MODEL_JUST_ER) !== -1;
                if (justER) {
                    return [{ name: domain.domainName, model: domain.model, justER, saying: await getFirstSayingName({ DomainModel }) }];
                }
                return { name: domain.domainName, model: domain.model, justER };
            }));

            formattedDomains = _.flatten(formattedDomains);
        }

        if (agent.domainRecognizer) {
            const name = agent.agentName + RASA_MODEL_DOMAIN_RECOGNIZER;
            formattedDomains.push({ name, model: name });
        }
        return formattedDomains;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
