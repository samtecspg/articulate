import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Remove from './action/action.remove.service';
import SplitAddedOldRemovedIds from './action/action.split-added-old-removed-ids.service';
import Upsert from './action/action.upsert.service';

module.exports = class ActionService extends Schmervice.Service {

    async upsert() {
        return await TimingWrapper({ cls: this, fn: Upsert, name: 'Upsert' }).apply(this, arguments);
    }

    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }

    splitAddedOldRemovedIds() {
        return SplitAddedOldRemovedIds.apply(this, arguments);
    }
};


