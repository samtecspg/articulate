import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import ConvertToInterval from './duckling/duckling.convert-interval.service';
import Parse from './duckling/duckling.parse.service';

module.exports = class DucklingService extends Schmervice.Service {

    async convertToInterval() {

        return await TimingWrapper({ fn: ConvertToInterval, name: 'DucklingService.convertToInterval' }).apply(this, arguments);
    }

    async parse() {

        return await TimingWrapper({ fn: Parse, name: 'DucklingService.parse' }).apply(this, arguments);
    }
};


