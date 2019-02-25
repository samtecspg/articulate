import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './frame/frame.create.service';
import Update from './frame/frame.update.service';

module.exports = class FrameService extends Schmervice.Service {

    async create() {

        return await TimingWrapper({ fn: Create, name: 'FrameService.create' }).apply(this, arguments);
    }

    async update() {

        return await TimingWrapper({ fn: Update, name: 'FrameService.update' }).apply(this, arguments);
    }

};


