import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './webhook/webhook.create.service';
import Remove from './webhook/webhook.remove.service';
import Update from './webhook/webhook.update.service';

module.exports = class WebhookService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async update() {
        return await TimingWrapper({ cls: this, fn: Update, name: 'Update' }).apply(this, arguments);
    }

    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }

};


