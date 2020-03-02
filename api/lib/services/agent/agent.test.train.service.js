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
        let errorCounter = 0;
        for (sayingCounter = 0; sayingCounter < agentSayings.data.length; sayingCounter++) {

            let errorPresent = false;

            let ParsedDocument = await agentService.parse({ AgentModel, text: agentSayings.data[sayingCounter].userSays, timezone: AgentModel.property('timezone'), saveDocument: false });

            let recognizedAction = ParsedDocument.recognized_action;
            let sayingAction = agentSayings.data[sayingCounter].actions.join('+__+');
            if (recognizedAction !== sayingAction) {
                result.data[errorCounter] = {};
                result.data[errorCounter].saying = agentSayings.data[sayingCounter];
                result.data[errorCounter].recognizedAction = recognizedAction;
                result.data[errorCounter].sayingAction = sayingAction
                result.data[errorCounter].actionError = true;
                errorPresent = true;
            }

            let recognizedKeywords = ParsedDocument.rasa_results[0].keywords.map((keyword) => { return { start: keyword.start, end: keyword.end, keyword: keyword.keyword, value: keyword.value.value } });
            let sayingKeywords = agentSayings.data[sayingCounter].keywords;
            let { recognizedKeywordsMissing, sayingKeywordsMissing } = getKeywordArraysDifference(recognizedKeywords, sayingKeywords);

            if (recognizedKeywordsMissing.length > 0 || sayingKeywordsMissing.length > 0) {
                if (!result.data[errorCounter]) {
                    result.data[errorCounter] = {};
                    result.data[errorCounter].saying = agentSayings.data[sayingCounter];
                }

                result.data[errorCounter].recognizedKeywordsMissing = recognizedKeywordsMissing;
                result.data[errorCounter].sayingKeywordsMissing = sayingKeywordsMissing;
                result.data[errorCounter].recognizedKeywordsMissingError = recognizedKeywordsMissing.length > 0;
                result.data[errorCounter].sayingKeywordsMissingError = sayingKeywordsMissing.length > 0;
                errorPresent = true;
            }

            if (errorPresent) {
                errorCounter++;
            }
        }
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