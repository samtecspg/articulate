import Schmervice from 'schmervice';
import PerformanceWrapper from '../../util/service-performance-wrapper';
import Create from './frame/frame.create.service';
import Update from './frame/frame.update.service';

module.exports = class FrameService extends Schmervice.Service {

    async create() {

        return await PerformanceWrapper({ fn: Create, name: 'FrameService.create' }).apply(this, arguments);
    }

    async update() {

        return await PerformanceWrapper({ fn: Update, name: 'FrameService.update' }).apply(this, arguments);
    }

};


