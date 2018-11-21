import Schmervice from 'schmervice';
import CreateFrame from './context/context.create-frame.service';
import Create from './context/context.create.service';
import FindBySession from './context/context.find-by-session.service';
import RemoveBySession from './context/context.remove-by-session.service';
import RemoveFramesBySessionId from './context/context.remove-frames-by-session.service';

module.exports = class ContextService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async findBySession() {

        return await FindBySession.apply(this, arguments);
    }

    async createFrame() {

        return await CreateFrame.apply(this, arguments);
    }

    async removeBySession() {

        return await RemoveBySession.apply(this, arguments);
    }

    async removeFramesBySessionId() {

        return await RemoveFramesBySessionId.apply(this, arguments);
    }
};


