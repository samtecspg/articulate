import { MODEL_CONTEXT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    sessionId: {
        type: 'string',
        unique: true,
        index: true,
        defaultSort: true
    },
    savedSlots: {
        type: 'json'
    },
    actionQueue: {
        type: 'json'
    },
    docIds: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    },
    listenFreeText: {
        type: 'boolean'
    }
};

class ContextRedisModel extends BaseModel {

    constructor() {

        super({ schema });
        this.publish = true;
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
