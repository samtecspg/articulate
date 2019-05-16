import { MODEL_CONNECTION } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    channel: {
        type: 'string',
        index: true,
        defaultSort: true
    },
    enabled: {
        type: 'boolean'
    },
    agent: {
        type: 'number',
        index: true,
    },
    status: {
        type: 'string'
    },
    details: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class ConnectionRedisModel extends BaseModel {
    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_CONNECTION;
    }

    static get idGenerator() {

        return null;
    }

    static get definitions() {

        return schema;
    }

}

module.exports = ConnectionRedisModel;
