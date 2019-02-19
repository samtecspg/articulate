import { MODEL_DOCUMENT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const properties = {
    document: {
        type: 'text'
    },
    time_stamp: {
        type: 'date'
    },
    maximum_action_score: {
        type: 'float'
    },
    maximum_category_score: {
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
    },
    agent_id: {
        type: 'integer'
    },
    agent_model: {
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
