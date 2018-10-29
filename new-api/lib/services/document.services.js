import Schmervice from 'schmervice';
import Create from './document/document.create.service';

module.exports = class ContextService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

};


