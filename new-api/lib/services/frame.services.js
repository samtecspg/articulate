import Schmervice from 'schmervice';
import Create from './frame/frame.create.service';
import Update from './frame/frame.update.service';

module.exports = class FrameService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async update() {

        return await Update.apply(this, arguments);
    }

};


