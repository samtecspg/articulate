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
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = SayingRedisModel;
