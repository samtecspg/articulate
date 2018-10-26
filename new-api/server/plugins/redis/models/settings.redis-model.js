import { MODEL_SETTINGS } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    name: {
        type: 'string',
        unique: true,
        index: true,
        defaultSort: true
    },
    value: {
        type: 'json'
    }
};

class SettingsRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_SETTINGS;
    }

    static get idGenerator() {
        //return 'increment';
        return 'default';
    }

    static get definitions() {

        return schema;
    }

    async findAll() {

        const ids = await this.find();
        return await this.findAllByIds({ ids });
    }

    async findByName({ name }) {

        return await this.searchByField({ field: 'name', value: name });
    }
}

module.exports = SettingsRedisModel;
