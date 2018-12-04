import Schmervice from 'schmervice';
import Create from './document/document.create.service';
import FindById from './document/document.find-by-id.service.js';
import Remove from './document/document.remove.service';
import Update from './document/document.update.service';

module.exports = class DocumentService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async update() {

        return await Update.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

    async findById() {

        return await FindById.apply(this, arguments);
    }

};


