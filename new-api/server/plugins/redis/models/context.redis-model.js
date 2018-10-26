import { MODEL_CONTEXT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

class ContextRedisModel extends BaseModel {

    static get modelName() {

        return MODEL_CONTEXT;
    }

    static get idGenerator() {
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return {
            action:{
                type: 'string'
            },
            slots: { //TODO: LINK
                type: 'json'
            }
        };
    }

}

module.exports = ContextRedisModel;
