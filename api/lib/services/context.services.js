import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './context/context.create.service';
import FindBySession from './context/context.find-by-session.service';
import FindDocsBySession from './context/context.find-docs-by-session.service';
import FindOrCreateSession from './context/context.find-or-create-session.service';
import RemoveBySession from './context/context.remove-by-session.service';
import Update from './context/context.update.service';

module.exports = class ContextService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async update() {
        return await TimingWrapper({ cls: this, fn: Update, name: 'Update' }).apply(this, arguments);
    }

    async findBySession() {
        return await TimingWrapper({ cls: this, fn: FindBySession, name: 'FindBySession' }).apply(this, arguments);
    }

    async findOrCreateSession() {
        return await TimingWrapper({ cls: this, fn: FindOrCreateSession, name: 'FindOrCreateSession' }).apply(this, arguments);
    }

    async findDocsBySession() {
        return await TimingWrapper({ cls: this, fn: FindDocsBySession, name: 'FindDocsBySession' }).apply(this, arguments);
    }

    async removeBySession() {
        return await TimingWrapper({ cls: this, fn: RemoveBySession, name: 'RemoveBySession' }).apply(this, arguments);
    }
};


