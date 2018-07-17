import Schmervice from 'schmervice';
import Remove from './action/action.remove.service';
import Upsert from './action/action.upsert.service';
import SplitAddedOldRemovedIds from './action/action.split-added-old-removed-ids.service';

module.exports = class ActionService extends Schmervice.Service {

    async upsert() {

        return await Upsert.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

    splitAddedOldRemovedIds() {

        return SplitAddedOldRemovedIds.apply(this, arguments);
    }
};


