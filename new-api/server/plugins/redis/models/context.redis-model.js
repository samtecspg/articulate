import { MODEL_CONTEXT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    sessionId: {
        type: 'string',
        unique: true,
        index: true,
        defaultSort: true
    },
    actionQueue: {
        type: 'json'
    },
    responseQueue: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class ContextRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_CONTEXT;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

    async findBySessionId({ sessionId }) {

        return await this.searchByField({ field: 'sessionId', value: sessionId });
    }

}

module.exports = ContextRedisModel;
