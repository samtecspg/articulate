import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import ConvertToInterval from './duckling/duckling.convert-interval.service';
import Parse from './duckling/duckling.parse.service';

module.exports = class DucklingService extends Schmervice.Service {

    async convertToInterval() {
        return await TimingWrapper({ cls: this, fn: ConvertToInterval, name: 'ConvertToInterval' }).apply(this, arguments);
    }

    async parse() {
        return await TimingWrapper({ cls: this, fn: Parse, name: 'Parse' }).apply(this, arguments);
    }
};


