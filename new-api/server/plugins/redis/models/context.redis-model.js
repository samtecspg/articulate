import { MODEL_CONTEXT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    sessionId: {
        type: 'string',
        unique: true,
        index: true,
        defaultSort: true
    }
};

class ContextRedisModel extends BaseModel {

    static get modelName() {

        return MODEL_CONTEXT;
    }

    static get idGenerator() {
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return schema;
    }

    async findBySessionId({ sessionId }) {

        return await this.searchByField({ field: 'sessionId', value: sessionId });
    }

}

module.exports = ContextRedisModel;
