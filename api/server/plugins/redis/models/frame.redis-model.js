import { MODEL_FRAME } from '../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    action: {
        type: 'string'
    },
    slots: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class FrameRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_FRAME;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = FrameRedisModel;
