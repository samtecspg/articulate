import {
    ACL_ACTION_CONVERSE,
    ACL_ACTION_READ,
    ACL_ACTION_WRITE,
    MODEL_AGENT
} from '../../../../util/constants';
import BaseModel from '../lib/base-model';
import { agentSchema } from './shared-schemas/agent-schema'

const defaults = {};

defaults.accessPolicies = {
    [`${MODEL_AGENT}:${ACL_ACTION_READ}`]: false,
    [`${MODEL_AGENT}:${ACL_ACTION_WRITE}`]: false,
    [`${MODEL_AGENT}:${ACL_ACTION_CONVERSE}`]: false
};

const schema = agentSchema;

class AgentRedisModel extends BaseModel {
    constructor() {

        super({ schema });
        this.publish = true;
        this.defaults = defaults;
    }

    static get modelName() {

        return MODEL_AGENT;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }
}

module.exports = AgentRedisModel;
