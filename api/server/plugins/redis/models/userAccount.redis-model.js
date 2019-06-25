import { MODEL_USER_ACCOUNT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    name: {
        type: 'string'
    },
    lastName: {
        type: 'string'
    },
    email: {
        type: 'string',
        unique: true
    },
    password: {
        type: 'string'
    },
    salt: {
        type: 'string'
    },
    isActive: {
        type: 'boolean',
        defaultValue: true,
        index: true
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class UserAccountRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_USER_ACCOUNT;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = UserAccountRedisModel;
