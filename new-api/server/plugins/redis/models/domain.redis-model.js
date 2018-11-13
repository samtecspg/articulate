import { MODEL_DOMAIN } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    domainName: {
        type: 'string',
        index: true,
        defaultSort: true
    },
    enabled: {
        type: 'boolean'
    },
    actionThreshold: {
        type: 'float'
    },
    status: {
        type: 'string'
    },
    lastTraining: {
        type: 'string'
    },
    model: {
        type: 'string'
    },
    extraTrainingData: {
        type: 'boolean'
    }
};

class DomainRedisModel extends BaseModel {
    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_DOMAIN;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = DomainRedisModel;
