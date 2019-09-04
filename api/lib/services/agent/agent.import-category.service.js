import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_ACTION,
    STATUS_OUT_OF_DATE,
    KEYWORD_PREFIX_SYS
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';
import Categories from '../../categories';

module.exports = async function (
    {
        id,
        categoryData,
        returnModel
    }
) {

    const { globalService, agentService, serverService } = await this.server.services();

    try {

        const categoryToImport = Categories[categoryData.categoryName];

        if (categoryToImport) {
            
            const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
            const isValidCategory = await agentService.isModelUnique({
                AgentModel,
                model: MODEL_CATEGORY,
                field: 'categoryName',
                value: categoryData.categoryName
            });

            if (isValidCategory) {

                const keywordsValidation = await Promise.all(categoryToImport.keywords.map(async (keyword) => {

                    return await agentService.isModelUnique({
                        AgentModel,
                        model: MODEL_KEYWORD,
                        field: 'keywordName',
                        value: keyword.keywordName
                    });
                }));

                if (keywordsValidation.indexOf(false) === -1){

                    const actionsValidation = await Promise.all(categoryToImport.actions.map(async (action) => {

                        return await agentService.isModelUnique({
                            AgentModel,
                            model: MODEL_ACTION,
                            field: 'actionName',
                            value: action.actionName
                        });
                    }));
    
                    if (actionsValidation.indexOf(false) === -1){
    
                        const keywordsDir = {};
                        await Promise.all(categoryToImport.keywords.map(async (keyword) => {

                            const newKeyword = await agentService.createKeyword({
                                AgentModel,
                                keywordData: keyword
                            });
                            keywordsDir[newKeyword.keywordName] = parseInt(newKeyword.id);
                        }));
                        
                        await Promise.all(categoryToImport.actions.map(async (action) => {

                            const { postFormat, webhook, ...actionData } = action;

                            actionData.slots = actionData.slots.map((tempSlot) => {

                                tempSlot.keywordId = tempSlot.keyword.indexOf(KEYWORD_PREFIX_SYS) === 0 ? 0 : keywordsDir[tempSlot.keyword];
                                return tempSlot;
                            });

                            const ActionModel = await agentService.createAction({
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

                        categoryData.categoryName = categoryToImport.info.name;
                        const CategoryModel = await agentService.createCategory({
                            AgentModel,
                            categoryData,
                            returnModel: true
                        });

                        await Promise.all(categoryToImport.sayings.map(async (saying) => {

                            saying.keywords.forEach((tempKeyword) => {
                                
                                tempKeyword.keywordId = tempKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS) === 0 ? 0 : keywordsDir[tempKeyword.keyword];
                                tempKeyword.keywordId = keywordsDir[tempKeyword.keyword];
                            });
                            return await agentService.upsertSayingInCategory({
                                id: AgentModel.id,
                                categoryId: CategoryModel.id,
                                sayingData: saying,
                                isImport: true
                            });
                        }));

                        const ServerModel = await serverService.get({ returnModel: true });
                        AgentModel.property('status', STATUS_OUT_OF_DATE);
                        ServerModel.property('status', STATUS_OUT_OF_DATE);
                        await AgentModel.saveInstance();
                        await ServerModel.saveInstance();

                        return returnModel ? CategoryModel : CategoryModel.allProperties();
                    }
    
                    const existingActions = categoryToImport.actions.filter((action, index) => {
    
                        return !actionsValidation[index];
                    }).map((existingAction) => {
    
                        return existingAction.actionName;
                    });
    
                    return Promise.reject(GlobalDefaultError({
                        message: `The ${MODEL_AGENT} already has ${MODEL_ACTION} with the name(s) = ${existingActions.join(', ')}.`,
                        statusCode: 404
                    }));
                }

                const existingKeywords = categoryToImport.keywords.filter((keyword, index) => {

                    return !keywordsValidation[index];
                }).map((existingKeyword) => {

                    return existingKeyword.keywordName;
                });

                return Promise.reject(GlobalDefaultError({
                    message: `The ${MODEL_AGENT} already has a ${MODEL_KEYWORD}(s) with the name(s) = ${existingKeywords.join(', ')}.`,
                    statusCode: 404
                }));
            }    

            return Promise.reject(GlobalDefaultError({
                message: `The ${MODEL_AGENT} already has a ${MODEL_CATEGORY} with the name= "${categoryData.categoryName}".`,
                statusCode: 404
            }));
        }

        return Promise.reject(GlobalDefaultError({
            message: `The category with the name "${categoryData.categoryName}" doesn't exist as a pre-built category.`,
            statusCode: 404
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
