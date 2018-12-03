import { MODEL_DOCUMENT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    document: {
        type: 'string'
    },
    time_stamp: {
        type: 'date'
    },
    maximum_saying_score: {
        type: 'float'
    },
    maximum_category_score: {
        type: 'float'
    },
    total_elapsed_time_ms: {
        type: 'string'
    },
    rasa_results: {
        type: 'json'
    }
};

module.exports = class DocumentRedisModel extends BaseModel {
    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_DOCUMENT;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

};
