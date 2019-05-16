import Schmervice from 'schmervice';
import Create from './server/server.create.service';
import Get from './server/server.get.service';
import Update from './server/server.update.service.js';

module.exports = class ServerService extends Schmervice.Service {

    async create(){

        return await Create.apply(this, arguments);
    }

    async get() {

        return await Get.apply(this, arguments);
    }

    async update() {

        return await Update.apply(this, arguments);
    }
};


