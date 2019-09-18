import {
    ACL_ACTION_READ,
    ACL_ACTION_WRITE,
    MODEL_ACCESS_POLICY_GROUP,
    MODEL_AGENT,
    MODEL_CONNECTION,
    MODEL_USER_ACCOUNT
} from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const logger = require('../../../../util/logger')({ name: `plugin:redis:AccessPolicyGroupModel` });

const defaults = {};

defaults.rules = {
    [`${MODEL_AGENT}:${ACL_ACTION_READ}`]: false,
    [`${MODEL_AGENT}:${ACL_ACTION_WRITE}`]: false,
    [`${MODEL_CONNECTION}:${ACL_ACTION_READ}`]: false,
    [`${MODEL_CONNECTION}:${ACL_ACTION_WRITE}`]: false,
    [`${MODEL_USER_ACCOUNT}:${ACL_ACTION_READ}`]: false,
    [`${MODEL_USER_ACCOUNT}:${ACL_ACTION_WRITE}`]: false,
    [`${MODEL_ACCESS_POLICY_GROUP}:${ACL_ACTION_READ}`]: false,
    [`${MODEL_ACCESS_POLICY_GROUP}:${ACL_ACTION_WRITE}`]: false
};

const schema = {
    name: {
        type: 'string',
        unique: true
    },
    rules: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class AccessPolicyGroupModel extends BaseModel {

    constructor() {

        super({ schema });
        this.defaults = defaults;
    }

    static get modelName() {

        return MODEL_ACCESS_POLICY_GROUP;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = AccessPolicyGroupModel;
