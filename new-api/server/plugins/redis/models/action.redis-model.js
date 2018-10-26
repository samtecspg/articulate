import { MODEL_ACTION } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    actionName: {
        type: 'string',
        unique: true,
        index: true
    },
    slots: {
        type: 'json'
    },
    responses: {
        type: 'json'
    },
    useWebhook: {
        type: 'boolean'
    },
    usePostFormat: {
        type: 'boolean'
    }
};

class ActionRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_ACTION;
    }

    static get idGenerator() {
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = ActionRedisModel;
