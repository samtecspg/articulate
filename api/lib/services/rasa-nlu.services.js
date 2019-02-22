import Schmervice from 'schmervice';
import PerformanceWrapper from '../../util/service-performance-wrapper';
import Parse from './rasa-nlu/rasa-nlu.parse.service';
import Train from './rasa-nlu/rasa-nlu.train.service';

module.exports = class RasaNLUService extends Schmervice.Service {

    async train() {

        return await PerformanceWrapper({ fn: Train, name: 'RasaNLUService.train' }).apply(this, arguments);
    }

    async parse() {

        return await PerformanceWrapper({ fn: Parse, name: 'RasaNLUService.parse' }).apply(this, arguments);
    }
};


