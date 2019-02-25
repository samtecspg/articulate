import { MODEL_ACTION } from '../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    actionName: {
        type: 'string',
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
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
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

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = ActionRedisModel;
