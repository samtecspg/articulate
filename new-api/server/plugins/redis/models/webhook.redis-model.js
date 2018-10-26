import { MODEL_WEBHOOK } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    webhookUrl: {
        type: 'string'
    },
    webhookVerb: {
        type: 'string'
    },
    webhookPayloadType: {
        type: 'string'
    },
    webhookPayload: {
        type: 'string'
    }
};

class WebhookRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_WEBHOOK;
    }

    static get idGenerator() {
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = WebhookRedisModel;
