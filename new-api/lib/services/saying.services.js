import Schmervice from 'schmervice';
import Remove from './saying/saying.remove.service';

module.exports = class SayingService extends Schmervice.Service {
    async remove() {

        return await Remove.apply(this, arguments);
    }
};


