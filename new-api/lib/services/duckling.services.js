import Schmervice from 'schmervice';
import ConvertToInterval from './duckling/duckling.convert-interval.service';
import Parse from './duckling/duckling.parse.service';

module.exports = class DucklingService extends Schmervice.Service {

    async convertToInterval() {

        return await ConvertToInterval.apply(this, arguments);
    }

    async parse() {

        return await Parse.apply(this, arguments);
    }
};


