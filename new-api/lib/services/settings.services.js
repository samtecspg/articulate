import Schmervice from 'schmervice';
import Create from './settings/settings.create.service';
import FindAll from './settings/settings.find-all.service';
import FindByName from './settings/settings.find-by-name.service';
import UpdateByName from './settings/settings.update-by-name.service';

module.exports = class SettingsService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async findAll() {

        return await FindAll.apply(this, arguments);
    }

    async findByName() {

        return await FindByName.apply(this, arguments);
    }

    async updateByName() {

        return await UpdateByName.apply(this, arguments);
    }

};


