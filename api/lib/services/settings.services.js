import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import BulkCreate from './settings/settings.bulk-create-settings.service';
import BulkUpdate from './settings/settings.bulk-update-settings.service';
import Create from './settings/settings.create.service';
import FindAll from './settings/settings.find-all.service';
import FindByName from './settings/settings.find-by-name.service';
import UpdateByName from './settings/settings.update-by-name.service';

module.exports = class SettingsService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async findAll() {
        return await TimingWrapper({ cls: this, fn: FindAll, name: 'FindAll' }).apply(this, arguments);
    }

    async findByName() {
        return await TimingWrapper({ cls: this, fn: FindByName, name: 'FindByName' }).apply(this, arguments);
    }

    async updateByName() {
        return await TimingWrapper({ cls: this, fn: UpdateByName, name: 'UpdateByName' }).apply(this, arguments);
    }

    async bulkCreate() {
        return await TimingWrapper({ cls: this, fn: BulkCreate, name: 'BulkCreate' }).apply(this, arguments);
    }

    async bulkUpdate() {
        return await TimingWrapper({ cls: this, fn: BulkUpdate, name: 'BulkUpdate' }).apply(this, arguments);
    }

};


