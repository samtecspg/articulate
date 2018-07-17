import Schmervice from 'schmervice';
import Create from './webhook/webhook.create.service';
import Remove from './webhook/webhook.remove.service';
import Update from './webhook/webhook.update.service';

module.exports = class WebhookService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async update() {

        return await Update.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

};


