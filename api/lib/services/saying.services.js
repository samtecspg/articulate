import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Remove from './saying/saying.remove.service';

module.exports = class SayingService extends Schmervice.Service {
    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }
};


