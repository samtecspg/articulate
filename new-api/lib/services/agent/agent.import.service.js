import _ from 'lodash';
import { STATUS_OUT_OF_DATE } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ payload }) {

    const { agentService } = await this.server.services();
    const {
        actions,
        domains,
        keywords,
        settings,
        postFormat: agentPostFormat,
        webhook: agentWebhook,
        ...agent
    } = payload;
    const keywordsDir = {};
    try {
        const AgentModel = await agentService.create({
            data: {
                ...agent,
                ...{
                    status: STATUS_OUT_OF_DATE,
                    enableModelsPerDomain: _.defaultTo(agent.enableModelsPerDomain, true),
                    multiDomain: _.defaultTo(agent.multiDomain, true),
                    extraTrainingData: _.defaultTo(agent.extraTrainingData, true)
                }
            },
            returnModel: true
        });

        if (settings) {
            await agentService.updateAllSettings({ AgentModel, settingsData: settings });
        }

        if (agent.usePostFormat) {
            await agentService.createPostFormat({
                AgentModel,
                postFormatData: agentPostFormat
            });
        }

        if (agent.useWebhook) {
            await agentService.createWebhook({
                AgentModel,
                webhookData: agentWebhook
            });
        }

        await Promise.all(keywords.map(async (keyword) => {

            const newKeyword = await agentService.createKeyword({
                AgentModel,
                keywordData: keyword
            });
            keywordsDir[newKeyword.keywordName] = parseInt(newKeyword.id);
        }));

        await Promise.all(domains.map(async (domain) => {

            const { sayings, ...domainData } = domain;
            const DomainModel = await agentService.createDomain({
                AgentModel,
                domainData,
                returnModel: true
            });
            return await Promise.all(sayings.map(async (saying) => {

                saying.keywords.forEach((tempKeyword) => {

                    tempKeyword.keywordId = keywordsDir[tempKeyword.keyword];
                });
                return await agentService.upsertSayingInDomain({
                    id: AgentModel.id,
                    domainId: DomainModel.id,
                    sayingData: saying
                });
            }));
        }));
        await Promise.all(actions.map(async (action) => {

            const { postFormat, webhook, ...actionData } = action;
            const ActionModel = await agentService.upsertAction({
                AgentModel,
                actionData
            });

            if (action.usePostFormat) {
                await agentService.upsertPostFormatInAction({
                    id: AgentModel.id,
                    actionId: ActionModel.id,
                    postFormatData: postFormat
                });
            }

            if (action.useWebhook) {
                await agentService.upsertWebhookInAction({
                    id: AgentModel.id,
                    actionId: ActionModel.id,
                    data: webhook
                });
            }
        }));
        return await agentService.export({ id: AgentModel.id });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
