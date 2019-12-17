import { MODEL_LOG } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

module.exports = class LogEsModel extends BaseModel {
    constructor({ client }) {

        super({
            name: MODEL_LOG,
            mappings: {},
            settings: {},
            client,
            registerConfiguration: false
        });
    }
};
