import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './agent-version/agent-version.create.service';
import Delete from './agent-version/agent-version.delete.service';

module.exports = class AgentVersionService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async delete() {
        return await TimingWrapper({ cls: this, fn: Delete, name: 'Delete' }).apply(this, arguments);
    }
};


