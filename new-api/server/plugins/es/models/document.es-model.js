import { MODEL_DOCUMENT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const properties = {
    document: {
        type: 'text'
    },
    time_stamp: {
        type: 'date'
    },
    maximum_saying_score: {
        type: 'float'
    },
    maximum_domain_score: {
        type: 'float'
    },
    total_elapsed_time_ms: {
        type: 'text'
    },
    rasa_results: {
        type: 'object'
    },
    session: {
        type: 'text'
    }
};

module.exports = class DocumentEsModel extends BaseModel {
    constructor({ client }) {

        super({
            name: MODEL_DOCUMENT,
            properties,
            client
        });
    }
};
