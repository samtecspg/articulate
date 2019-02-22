import Schmervice from 'schmervice';
import PerformanceWrapper from '../../util/service-performance-wrapper';
import ConvertToInterval from './duckling/duckling.convert-interval.service';
import Parse from './duckling/duckling.parse.service';

module.exports = class DucklingService extends Schmervice.Service {

    async convertToInterval() {

        return await PerformanceWrapper({ fn: ConvertToInterval, name: 'DucklingService.convertToInterval' }).apply(this, arguments);
    }

    async parse() {

        return await PerformanceWrapper({ fn: Parse, name: 'DucklingService.parse' }).apply(this, arguments);
    }
};


