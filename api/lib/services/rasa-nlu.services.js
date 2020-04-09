import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Parse from './rasa-nlu/rasa-nlu.parse.service';
import Train from './rasa-nlu/rasa-nlu.train.service';

module.exports = class RasaNLUService extends Schmervice.Service {

    async train() {
        return await TimingWrapper({ cls: this, fn: Train, name: 'Train' }).apply(this, arguments);
    }

    async parse() {
        return await TimingWrapper({ cls: this, fn: Parse, name: 'Parse' }).apply(this, arguments);
    }
};


