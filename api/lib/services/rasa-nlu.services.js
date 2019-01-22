import Schmervice from 'schmervice';
import Parse from './rasa-nlu/rasa-nlu.parse.service';
import Train from './rasa-nlu/rasa-nlu.train.service';

module.exports = class RasaNLUService extends Schmervice.Service {

    async train() {

        return await Train.apply(this, arguments);
    }

    async parse() {

        return await Parse.apply(this, arguments);
    }
};


