import Schmervice from 'schmervice';
import Create from './document/document.create.service';

module.exports = class DocumentService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

};


