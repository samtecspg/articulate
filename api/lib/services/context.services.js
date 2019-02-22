import Schmervice from 'schmervice';
import PerformanceWrapper from '../../util/service-performance-wrapper';
import CreateFrame from './context/context.create-frame.service';
import Create from './context/context.create.service';
import FindBySession from './context/context.find-by-session.service';
import FindFrameBySessionIdAndFrameId from './context/context.find-frame-by-session-and-frame.service';
import FindFramesBySession from './context/context.find-frames-by-session.service';
import RemoveBySession from './context/context.remove-by-session.service';
import RemoveFramesBySessionIdAndFrameId from './context/context.remove-frames-by-session-and-frame.service';
import RemoveFramesBySessionId from './context/context.remove-frames-by-session.service';
import UpdateFrameBySessionIdAndFrameId from './context/context.update-frame-by-session-and-frame.service';
import Update from './context/context.update.service';

module.exports = class ContextService extends Schmervice.Service {

    async create() {

        return await PerformanceWrapper({ fn: Create, name: 'ContextService.create' }).apply(this, arguments);
    }

    async createFrame() {

        return await CreateFrame.apply(this, arguments);
    }

    async updateFrameBySessionAndFrame() {

        return await UpdateFrameBySessionIdAndFrameId.apply(this, arguments);
    }

    async update() {

        return await PerformanceWrapper({ fn: Update, name: 'ContextService.update' }).apply(this, arguments);
    }

    async findBySession() {

        return await PerformanceWrapper({ fn: FindBySession, name: 'ContextService.findBySession' }).apply(this, arguments);
    }

    async findFramesBySession() {

        return await FindFramesBySession.apply(this, arguments);
    }

    async findFrameBySessionAndFrame() {

        return await FindFrameBySessionIdAndFrameId.apply(this, arguments);
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

    async removeFramesBySessionIdAndFrameId() {

        return await RemoveFramesBySessionIdAndFrameId.apply(this, arguments);
    }
};


