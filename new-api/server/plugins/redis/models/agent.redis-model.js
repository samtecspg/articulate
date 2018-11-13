import { MODEL_AGENT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    agentName: {
        type: 'string',
        unique: true,
        index: true,
        defaultSort: true
    },
    description: {
        type: 'string',
        index: true
    },
    language: {
        type: 'string'
    },
    timezone: {
        type: 'string'
    },
    useWebhook: {
        type: 'boolean'
    },
    usePostFormat: {
        type: 'boolean'
    },
    multiDomain: {
        type: 'boolean'
    },
    domainClassifierThreshold: {
        type: 'float'
    },
    fallbackResponses: {
        type: 'json'
    },
    status: {
        type: 'string'
    },
    lastTraining: {
        type: 'string'
    },
    extraTrainingData: {
        type: 'boolean'
    },
    enableModelsPerDomain: {
        type: 'boolean'
    },
    model: {
        type: 'string'
    },
    settings: {
        type: 'json'
    },
    domainRecognizer: {
        type: 'boolean',
        defaultValue: false
    }
};

class AgentRedisModel extends BaseModel {
    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_AGENT;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }
}

module.exports = AgentRedisModel;
