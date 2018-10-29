import { MODEL_FRAME } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    intent: {
        type: 'string'
    },
    scenario: {
        type: 'string'
    },
    slots: {
        type: 'json'
    }
};

class FrameRedisModel extends BaseModel {

    static get modelName() {

        return MODEL_FRAME;
    }

    static get idGenerator() {
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return schema;
    }

    async findBySession({ session }) {

        return await this.searchByField({ field: 'session', value: session });
    }

}

module.exports = FrameRedisModel;
