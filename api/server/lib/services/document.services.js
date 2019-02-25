import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './document/document.create.service';
import FindByAgentId from './document/document.find-by-agent-id.service';
import FindById from './document/document.find-by-id.service.js';
import Remove from './document/document.remove.service';
import Search from './document/document.search.service';
import Update from './document/document.update.service';

module.exports = class DocumentService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async update() {

        return await TimingWrapper({ fn: Update, name: 'DocumentService.update' }).apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

    async findById() {

        return await FindById.apply(this, arguments);
    }

    async search() {

        return await Search.apply(this, arguments);
    }

    async findByAgentId() {

        return await FindByAgentId.apply(this, arguments);
    }

};


