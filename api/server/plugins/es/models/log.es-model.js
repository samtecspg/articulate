import { MODEL_LOG } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const getNameForCreate = (name) => {
    return name;
}
const getNameForSearch = (name) => {
    return name;
}

module.exports = class LogEsModel extends BaseModel {
    constructor({ client }) {

        super({
            name: MODEL_LOG,
            mappings: {},
            settings: {},
            client,
            registerConfiguration: false,
            isMappingTemplate: false,
            getNameForCreate,
            getNameForSearch
        });
    }
};
