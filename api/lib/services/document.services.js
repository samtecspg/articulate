import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './document/document.create.service';
import DeleteByQuery from './document/document.delete-by-query.service';
import FindAllSessions from './document/document.find-all-sessions';
import FindByAgentId from './document/document.find-by-agent-id.service';
import FindById from './document/document.find-by-id.service.js';
import Remove from './document/document.remove.service';
import Search from './document/document.search.service';
import Update from './document/document.update.service';

module.exports = class DocumentService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async update() {
        return await TimingWrapper({ cls: this, fn: Update, name: 'Update' }).apply(this, arguments);
    }

    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }

    async findById() {
        return await TimingWrapper({ cls: this, fn: FindById, name: 'FindById' }).apply(this, arguments);
    }

    async search() {
        return await TimingWrapper({ cls: this, fn: Search, name: 'Search' }).apply(this, arguments);
    }

    async findByAgentId() {
        return await TimingWrapper({ cls: this, fn: FindByAgentId, name: 'FindByAgentId' }).apply(this, arguments);
    }

    async deleteByQuery() {
        return await TimingWrapper({ cls: this, fn: DeleteByQuery, name: 'DeleteByQuery' }).apply(this, arguments);
    }

    async findAllSessions() {
        return await TimingWrapper({ cls: this, fn: FindAllSessions, name: 'FindAllSessions' }).apply(this, arguments);
    }
};


