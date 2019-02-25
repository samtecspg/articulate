import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Parse from './rasa-nlu/rasa-nlu.parse.service';
import Train from './rasa-nlu/rasa-nlu.train.service';

module.exports = class RasaNLUService extends Schmervice.Service {

    async train() {

        return await TimingWrapper({ fn: Train, name: 'RasaNLUService.train' }).apply(this, arguments);
    }

    async parse() {

        return await TimingWrapper({ fn: Parse, name: 'RasaNLUService.parse' }).apply(this, arguments);
    }
};


