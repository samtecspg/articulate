import Schmervice from 'schmervice';
import Create from './context/context.create.service';
import FindBySession from './context/context.find-by-session.service';
import FindOrCreateSession from './context/context.find-or-create-session.service';
import FindDocsBySession from './context/context.find-docs-by-session.service';
import RemoveBySession from './context/context.remove-by-session.service';
import Update from './context/context.update.service';

module.exports = class ContextService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async update() {

        return await Update.apply(this, arguments);
    }

    async findBySession() {

        return await FindBySession.apply(this, arguments);
    }

    async findOrCreateSession() {

        return await FindOrCreateSession.apply(this, arguments);
    }

    async findDocsBySession() {

        return await FindDocsBySession.apply(this, arguments);
    }

    async removeBySession() {

        return await RemoveBySession.apply(this, arguments);
    }
};


