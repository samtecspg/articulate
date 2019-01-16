import { MODEL_KEYWORD } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    keywordName: {
        type: 'string',
        index: true,
        defaultSort: true
    },
    uiColor: {
        type: 'string'
    },
    examples: {
        type: 'json'
    },
    regex: {
        type: 'string'
    },
    type: {
        type: 'string'
    },
    modifiers: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class KeywordRedisModel extends BaseModel {
    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_KEYWORD;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = KeywordRedisModel;
