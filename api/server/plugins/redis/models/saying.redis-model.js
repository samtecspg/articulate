import { MODEL_SAYING } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    userSays: {
        type: 'string'
    },
    keywords: {
        type: 'json'
    },
    actions: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    },
    starred: {
        type: 'boolean'
    },
    lastFailedTestingTimestamp: {
        type: 'timestamp'
    }
};

class SayingRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_SAYING;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = SayingRedisModel;
