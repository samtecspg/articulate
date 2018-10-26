import { MODEL_DOMAIN } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    domainName: {
        type: 'string',
        unique: true,
        index: true,
        defaultSort: true
    },
    enabled: {
        type: 'boolean'
    },
    actionThreshold: {
        type: 'integer'
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
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = DomainRedisModel;
