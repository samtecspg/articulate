import {
    RASA_ACTION_RANKING,
    RASA_INTENT_RANKING
} from '../../../util/constants';

module.exports = async function (
    {
        text,
        project,
        trainedDomain,
        baseURL = null
    }) {

    const { [`rasa-nlu`]: rasaNLU } = this.server.app;

    const result = await rasaNLU.parse({
        q: text,
        project,
        model: trainedDomain.model,
        baseURL
    });
    delete result.text;
    const temporalParse = {
        domain: trainedDomain.name
    };
    result.entities.forEach((entity, index) => {

        result.entities[index].keyword = entity.entity;
        delete result.entities[index].entity;
    });
    result.keywords = result.entities;
    delete result.entities;
    if (trainedDomain.justER) {
        delete result.intent;
        result.action = {
            name: trainedDomain.saying,
            confidence: 1
        };
    }
    else {
        result.action = result.intent;
        delete result.intent;
    }
    if (result[RASA_INTENT_RANKING]) {
        result[RASA_ACTION_RANKING] = result[RASA_INTENT_RANKING];
        delete result[RASA_INTENT_RANKING];
    }

    return { ...temporalParse, ...result };
};
