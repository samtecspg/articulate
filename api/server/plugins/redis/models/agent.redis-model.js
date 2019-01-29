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
    multiCategory: {
        type: 'boolean'
    },
    categoryClassifierThreshold: {
        type: 'float'
    },
    fallbackAction: {
        type: 'string'
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
    enableModelsPerCategory: {
        type: 'boolean'
    },
    model: {
        type: 'string'
    },
    parameters: {
        type: 'json'
    },
    settings: {
        type: 'json'
    },
    categoryRecognizer: {
        type: 'boolean',
        defaultValue: false
    },
    modifiersRecognizer: {
        type: 'boolean',
        defaultValue: false
    },
    modifiersRecognizerJustER: {
        type: 'string',
        defaultValue: ''        
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class AgentRedisModel extends BaseModel {
    constructor() {

        super({ schema });
        this.publish = true;
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
