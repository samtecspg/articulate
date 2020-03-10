import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_KEYWORD,
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, debug = false }) {

    try {
        const { redis } = this.server.app;
        const { agentService, globalService, keywordService } = await this.server.services();

        const AgentModel = await redis.factory(MODEL_AGENT, id);
        const agentSayings = await agentService.findAllSayings({ id });

        const agentKeywords = await await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_KEYWORD, returnModel: false });
        //let ParsedDocument = await agentService.parse({ AgentModel, text: agentKeywords[0].modifiers[0].sayings[0].userSays, timezone: AgentModel.property('timezone'), saveDocument: false });

        var sayingCounter;
        let result = {};
        result.data = [];
        result.keywords = [];
        result.actions = [];
        let errorCounter = 0;
        for (sayingCounter = 0; sayingCounter < agentSayings.data.length; sayingCounter++) {

            let errorPresent = false;

            let ParsedDocument = await agentService.parse({ AgentModel, text: agentSayings.data[sayingCounter].userSays, timezone: AgentModel.property('timezone'), saveDocument: false });

            let recognizedAction = ParsedDocument.recognized_action;
            let sayingAction = agentSayings.data[sayingCounter].actions.join('+__+');
            if (recognizedAction !== sayingAction) {
                upsertResultAction(result, sayingAction, 'bad', agentSayings.data[sayingCounter].id);
                result.data[errorCounter] = {};
                result.data[errorCounter].saying = agentSayings.data[sayingCounter];
                result.data[errorCounter].saying.recognizedAction = recognizedAction;
                result.data[errorCounter].saying.sayingAction = sayingAction
                result.data[errorCounter].saying.actionError = true;
                errorPresent = true;
            } else {
                upsertResultAction(result, sayingAction, 'good', agentSayings.data[sayingCounter].id);
            }

            let recognizedKeywords = ParsedDocument.rasa_results[0].keywords.map((keyword) => { return { start: keyword.start, end: keyword.end, keyword: keyword.keyword, value: keyword.value.value } });
            let sayingKeywords = agentSayings.data[sayingCounter].keywords;
            let { recognizedKeywordsMissing, sayingKeywordsMissing } = getKeywordArraysDifference(recognizedKeywords, sayingKeywords);

            if (recognizedKeywordsMissing.length > 0 || sayingKeywordsMissing.length > 0) {
                if (!result.data[errorCounter]) {
                    result.data[errorCounter] = {};
                    result.data[errorCounter].saying = agentSayings.data[sayingCounter];
                }

                result.data[errorCounter].saying.recognizedKeywordsMissing = recognizedKeywordsMissing;
                result.data[errorCounter].saying.sayingKeywordsMissing = sayingKeywordsMissing;
                result.data[errorCounter].saying.recognizedKeywordsMissingError = recognizedKeywordsMissing.length > 0;
                result.data[errorCounter].saying.sayingKeywordsMissingError = sayingKeywordsMissing.length > 0;
                errorPresent = true;
            }

            upsertResultKeywords(result, sayingKeywords, recognizedKeywords, agentSayings.data[sayingCounter].id);

            if (errorPresent) {
                errorCounter++;
            }
        }

        result.agentId = id;
        result.totalSayings = agentSayings.data.length;
        result.goodSayings = agentSayings.data.length - errorCounter;
        result.badSayings = errorCounter;

        return result;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};

const getKeywordArraysDifference = function (recognizedKeywords, sayingKeywords) {

    let recognizedKeywordsMissing = [];
    let sayingKeywordsMissing = [];

    recognizedKeywordsMissing = recognizedKeywords.filter(function (obj) {
        return !sayingKeywords.some(function (obj2) {
            return obj.end == obj2.end &&
                obj.start == obj2.start &&
                obj.keyword == obj2.keyword
        });
    });

    sayingKeywordsMissing = sayingKeywords.filter(function (obj) {
        return !recognizedKeywords.some(function (obj2) {
            return obj.end == obj2.end &&
                obj.start == obj2.start &&
                obj.keyword == obj2.keyword
        });
    });

    return { recognizedKeywordsMissing, sayingKeywordsMissing };
}

const upsertResultAction = function (result, sayingAction, condition, sayingId) {
    let actionIndex = result.actions.findIndex(action => { return action.actionName === sayingAction })
    if (actionIndex === -1) {
        result.actions.push({
            actionName: sayingAction,
            good: condition === 'good' ? 1 : 0,
            bad: condition === 'bad' ? 1 : 0,
            badSayings: condition === 'bad' ? [sayingId] : []
        })
    } else {
        if (condition === 'good') {
            result.actions[actionIndex].good++;
        } else {
            result.actions[actionIndex].bad++;
            result.actions[actionIndex].badSayings.push(sayingId);
        }
    }
    var a = 1;
}

const upsertResultKeywords = function (result, sayingKeywords, recognizedKeywords, sayingId) {
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
        let a = 1;
    });
}