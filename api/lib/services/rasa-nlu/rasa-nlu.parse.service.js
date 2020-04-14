import {
    RASA_ACTION_RANKING,
    RASA_INTENT_RANKING
} from '../../../util/constants';

import { Semaphore } from 'await-semaphore';
var mainSemaphore = new Semaphore(1);
var semaphores = {};
const loadbalance = require('loadbalance')
var loadBalancers = {};
const Crypto = require('crypto');

module.exports = async function (
    {
        text,
        project,
        trainedCategory,
        baseURLs = null,
        rasaConcurrentRequests = null,
    }) {

    const { [`rasa-nlu`]: rasaNLU } = this.server.app;

    var urls = baseURLs;
    var urlsHash = Crypto.createHash('md5').update(urls.join()).digest("hex");
    var loadBalancerName = project + urlsHash;
    var release = await mainSemaphore.acquire();
    if (!semaphores[project + '-' + rasaConcurrentRequests]) {
        semaphores[project + '-' + rasaConcurrentRequests] = new Semaphore(rasaConcurrentRequests);
    }
    if (urls.length > 1 && !loadBalancers[loadBalancerName]) {
        loadBalancers[loadBalancerName] = loadbalance.roundRobin(urls);
    }
    release();

    release = await semaphores[project + '-' + rasaConcurrentRequests].acquire();
    var result;
    try {
        result = await rasaNLU.Parse({
            q: text,
            project,
            model: trainedCategory.model,
            baseURL: urls.length === 1 ? urls[0] : loadBalancers[loadBalancerName].pick()
        });
    } catch (err) {
        release();
        throw (err);
    }
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
