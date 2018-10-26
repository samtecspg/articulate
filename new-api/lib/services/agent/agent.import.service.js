import _ from 'lodash';
import { STATUS_OUT_OF_DATE } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ payload }) {

    const { agentService } = await this.server.services();
    const {
        actions,
        domains,
        keywords,
        postFormat: agentPostFormat,
        webhook: agentWebhook,
        ...agent
    } = payload;
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

        await agentService.createPostFormat({
            AgentModel,
            postFormatData: agentPostFormat
        });

        await agentService.createWebhook({
            AgentModel,
            webhookData: agentWebhook
        });

        await Promise.all(keywords.map(async (keyword) =>

            await agentService.createKeyword({
                AgentModel,
                keywordData: keyword
            })
        ));

        await Promise.all(domains.map(async (domain) => {

            const { sayings, ...domainData } = domain;
            const DomainModel = await agentService.createDomain({
                AgentModel,
                domainData,
                returnModel: true
            });
            return await Promise.all(sayings.map(async (saying) => {

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
            return await Promise.all([
                await agentService.upsertPostFormatInAction({
                    id: AgentModel.id,
                    actionId: ActionModel.id,
                    postFormatData: postFormat
                }),
                await agentService.upsertWebhookInAction({
                    id: AgentModel.id,
                    actionId: ActionModel.id,
                    data: webhook
                })
            ]);
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
