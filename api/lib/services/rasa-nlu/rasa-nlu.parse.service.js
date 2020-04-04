import {
    RASA_ACTION_RANKING,
    RASA_INTENT_RANKING
} from '../../../util/constants';

import { Semaphore } from 'await-semaphore';
var mainSemaphore = new Semaphore(2);

module.exports = async function (
    {
        text,
        project,
        trainedCategory,
        baseURL = null
    }) {

    const { [`rasa-nlu`]: rasaNLU } = this.server.app;

    var release = await mainSemaphore.acquire();
    const result = await rasaNLU.Parse({
        q: text,
        project,
        model: trainedCategory.model,
        baseURL
    });
    release();

    delete result.text;
    const temporalParse = {
        category: trainedCategory.name
    };
    result.entities.forEach((entity, index) => {

        result.entities[index].keyword = entity.entity;
        delete result.entities[index].entity;
    });
    result.keywords = result.entities;
    delete result.entities;
    if (trainedCategory.justER) {
        delete result.intent;
        result.action = {
            name: trainedCategory.saying,
            confidence: 1
        };
    }
    else {
        result.action = result.intent.name ? result.intent : {
            name: '',
            confidence: result.intent.confidence
        };
        delete result.intent;
    }
    if (result[RASA_INTENT_RANKING]) {
        result[RASA_ACTION_RANKING] = result[RASA_INTENT_RANKING];
        delete result[RASA_INTENT_RANKING];
    }

    return { ...temporalParse, ...result };
};
