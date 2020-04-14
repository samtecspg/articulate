import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './server/server.create.service';
import Get from './server/server.get.service';
import Update from './server/server.update.service.js';

module.exports = class ServerService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async get() {
        return await TimingWrapper({ cls: this, fn: Get, name: 'Get' }).apply(this, arguments);
    }

    async update() {
        return await TimingWrapper({ cls: this, fn: Update, name: 'Update' }).apply(this, arguments);
    }
};


