import { MODEL_CATEGORY } from '../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    categoryName: {
        type: 'string',
        index: true,
        defaultSort: true
    },
    enabled: {
        type: 'boolean'
    },
    actionThreshold: {
        type: 'float'
    },
    status: {
        type: 'string'
    },
    lastTraining: {
        type: 'string'
    },
    model: {
        type: 'string'
    },
    extraTrainingData: {
        type: 'boolean'
    },
    parameters: {
        type: 'json'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class CategoryRedisModel extends BaseModel {
    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_CATEGORY;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = CategoryRedisModel;
