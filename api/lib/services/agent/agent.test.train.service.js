import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_KEYWORD,
    MODEL_SAYING,
    MODEL_CATEGORY,
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, debug = false }) {

    try {
        const { redis } = this.server.app;
        const { agentService, globalService, trainingTestService } = await this.server.services();
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        const agentSayings = await agentService.findAllSayings({ id, limit: -1 });
        const agentKeywords = await await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_KEYWORD, returnModel: false });
        const agentKeywordsColors = {};

        agentKeywords.forEach(keyword => {
            agentKeywordsColors[keyword.keywordName] = keyword.uiColor;
        })

        var sayingCounter;
        let result = {};
        result.timeStamp = Date.now();
        result.agentId = id;

        result.keywords = [];
        result.actions = [];
        let errorCounter = 0;

        for (sayingCounter = 0; sayingCounter < agentSayings.data.length; sayingCounter++) {

            let errorPresent = false;
            let badKeywords = [];
            let badActions = [];

            let ParsedDocument = await agentService.parse({ AgentModel, text: agentSayings.data[sayingCounter].userSays, timezone: AgentModel.property('timezone'), saveDocument: false });

            let recognizedAction = ParsedDocument.recognized_action;
            //For multi actions
            let sayingAction = agentSayings.data[sayingCounter].actions.join('+__+');

            errorPresent = upsertResultAction(result, sayingAction, recognizedAction, agentSayings.data[sayingCounter].id, badActions);

            let recognizedKeywords = ParsedDocument.rasa_results[0].keywords.map((keyword) => { return { start: keyword.start, end: keyword.end, keyword: keyword.keyword, value: keyword.value.value } });
            let sayingKeywords = agentSayings.data[sayingCounter].keywords;
            errorPresent = errorPresent || upsertResultKeywords(result, sayingKeywords, recognizedKeywords, agentSayings.data[sayingCounter].id, badKeywords);

            if (errorPresent) {
                errorCounter++;
                await updateFailedSaying(agentSayings.data[sayingCounter].id, result, globalService, agentService, AgentModel, badKeywords, badActions)
            }
        }

        result.totalSayings = agentSayings.data.length;
        result.goodSayings = agentSayings.data.length - errorCounter;
        result.badSayings = errorCounter;

        updateResultAccuracyAndColors(result, agentKeywordsColors);
        await trainingTestService.create({ data: result });
        return result;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};

const upsertResultAction = function (result, sayingAction, recognizedAction, sayingId, badActions) {
    let errorPresent = false;
    let condition = 'bad';
    if (recognizedAction !== sayingAction) {
        errorPresent = true;
    } else {
        condition = 'good';
    }

    let actionIndex = result.actions.findIndex(action => { return action.actionName === sayingAction })
    if (actionIndex === -1) {
        result.actions.push({
            actionName: sayingAction,
            good: condition === 'good' ? 1 : 0,
            bad: condition === 'bad' ? 1 : 0,
            badSayings: condition === 'bad' ? [sayingId] : []
        })
        if (condition === 'bad') {
            badActions.push(sayingAction);
        }
    } else {
        if (condition === 'good') {
            result.actions[actionIndex].good++;
        } else {
            result.actions[actionIndex].bad++;
            result.actions[actionIndex].badSayings.push(sayingId);
            badActions.push(sayingAction);
        }
    }
    return errorPresent;
}

const upsertResultKeywords = function (result, sayingKeywords, recognizedKeywords, sayingId, badKeywords) {
    let errorPresent = false;
    sayingKeywords.forEach(sayingKeyword => {
        let recognizedKeywordsIndex = recognizedKeywords.findIndex(
            recognizedKeyword => {
                return recognizedKeyword.end == sayingKeyword.end &&
                    recognizedKeyword.start == sayingKeyword.start &&
                    recognizedKeyword.keyword == sayingKeyword.keyword
            });
        let condition = 'bad';
        if (recognizedKeywordsIndex !== -1) {
            condition = 'good';
        } else {
            errorPresent = true;
            badKeywords.push(sayingKeyword.keyword);
        }

        let resultKeywordIndex = result.keywords.findIndex(keyword => { return keyword.keywordName === sayingKeyword.keyword });
        if (resultKeywordIndex === -1) {
            result.keywords.push({
                keywordName: sayingKeyword.keyword,
                good: condition === 'good' ? 1 : 0,
                bad: condition === 'bad' ? 1 : 0,
                badSayings: condition === 'bad' ? [sayingId] : []
            })
        } else {
            if (condition === 'good') {
                result.keywords[resultKeywordIndex].good++;
            } else {
                result.keywords[resultKeywordIndex].bad++;
                result.keywords[resultKeywordIndex].badSayings.push(sayingId);
            }
        }
    });
    return errorPresent;
}

const updateFailedSaying = async function (sayingId, result, globalService, agentService, AgentModel, badKeywords, badActions) {
    let sayingModel = await globalService.findById({ id: sayingId, model: MODEL_SAYING, returnModel: true });
    let category = await globalService.loadAllLinked({ parentModel: sayingModel, model: MODEL_CATEGORY, returnModel: true });
    let sayingData = sayingModel.allProperties();
    sayingData.lastFailedTestingTimestamp = result.timeStamp;
    if (badKeywords.length > 0) {
        sayingData.lastFailedTestingKeywords = badKeywords;
        sayingData.lastFailedTestingKeywordsTimeStamp = result.timeStamp;
    }
    if (badActions.length > 0) {
        sayingData.lastFailedTestingActions = badActions;
        sayingData.lastFailedTestingActionsTimeStamp = result.timeStamp;
    }
    delete sayingData.id;
    await agentService.upsertSayingInCategory({
        id: Number(AgentModel.id),
        categoryId: Number(category[0].id),
        sayingId: Number(sayingModel.id),
        sayingData,
        updateStatus: false
    });
}

const updateResultAccuracyAndColors = function (result, agentKeywordsColors) {

    result.actions = result.actions.map(action => {
        return {
            ...action,
            accuracy: action.good / (action.bad + action.good)
        }
    })
    result.actions = result.actions.sort((a, b) => { return a.accuracy - b.accuracy });

    result.keywords = result.keywords.map(keyword => {
        return {
            ...keyword,
            accuracy: keyword.good / (keyword.bad + keyword.good),
            uiColor: agentKeywordsColors[keyword.keywordName]
        }
    })
    result.keywords = result.keywords.sort((a, b) => { return a.accuracy - b.accuracy });
    result.accuracy = result.goodSayings / (result.goodSayings + result.badSayings)
}