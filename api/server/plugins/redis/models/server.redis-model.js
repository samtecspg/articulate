import { MODEL_SERVER, } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    name: {
        type: 'string'
    },
    version: {
        type: 'string'
    },
    status: {
        type: 'string'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class ServerRedisModel extends BaseModel {
    constructor() {

        super({ schema });
        this.publish = true;
    }

    static get modelName() {

        return MODEL_SERVER;
    }

    async findServerId() {

        const ids = await this.find();
        return ids[0];
    }

    static get definitions() {

        return schema;
    }
}
module.exports = ServerRedisModel;
