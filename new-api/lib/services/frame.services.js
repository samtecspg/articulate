import Schmervice from 'schmervice';
import Create from './frame/frame.create.service';

module.exports = class FrameService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

};


