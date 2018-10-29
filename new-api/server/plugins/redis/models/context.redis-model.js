import { MODEL_CONTEXT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    session: {
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

}

module.exports = ContextRedisModel;
