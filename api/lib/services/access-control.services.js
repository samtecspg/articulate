import Schmervice from 'schmervice';
import Remove from './access-controll/access-control.remove.service';
import Upsert from './access-controll/access-control.upsert.service';
import Validate from './access-controll/access-control.validate.service';
import FindByName from './access-controll/access-control.find-by-name.service';
import BulkUpdate from './access-controll/access-control.bulk-update.service';

module.exports = class AccessControlService extends Schmervice.Service {

    async upsert() {

        return await Upsert.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

    async validate() {

        return await Validate.apply(this, arguments);
    }
    async findByName() {

        return await FindByName.apply(this, arguments);
    }

    async bulkUpdate() {

        return await BulkUpdate.apply(this, arguments);
    }
};


