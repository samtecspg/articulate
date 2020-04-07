import { MODEL_TRAINING_TEST } from '../../../../util/constants';
import BaseModel from '../lib/base-model';
import { integerProperty } from 'nohm';

const mappings = {
    properties: {
        agentId: {
            type: 'integer'
        },
        timeStamp: {
            type: 'date'
        },
        totalSayings: {
            type: 'integer'
        },
        goodSayings: {
            type: 'integer'
        },
        badSayings: {
            type: 'integer'
        },
        accuracy: {
            type: 'float'
        },
        keywords: {
            type: 'nested',
            properties: {
                keywordName: {
                    type: 'text'
                },
                good: {
                    type: 'integer'
                },
                bad: {
                    type: 'integer'
                },
                badSayings: {
                    type: 'integer'
                },
                accuracy: {
                    type: 'float'
                },
            }
        },
        actions: {
            type: 'nested',
            properties: {
                actionName: {
                    type: 'text'
                },
                good: {
                    type: 'integer'
                },
                bad: {
                    type: 'integer'
                },
                badSayings: {
                    type: 'integer'
                },
                accuracy: {
                    type: 'float'
                },
            }
        }
    }
};

const settings = {
    'index.mapping.total_fields.limit': 5000
};

const getNameForCreate = (name) => {
    return name;
}
const getNameForSearch = (name) => {
    return name;
}

module.exports = class DocumentEsModel extends BaseModel {
    constructor({ client }) {

        super({
            name: MODEL_TRAINING_TEST,
            mappings,
            settings,
            client,
            registerConfiguration: true,
            isMappingTemplate: false,
            getNameForCreate,
            getNameForSearch
        });
    }
};
