import Schmervice from 'schmervice';
import Train from './rasa-nlu/rasa-nlu.train.service';

module.exports = class RasaNLUService extends Schmervice.Service {

    async train() {

        return await Train.apply(this, arguments);
    }
};


