import Schmervice from 'schmervice';
import Create from './training-test/training-test.create.service';
import FindByAgentId from './training-test/training-test.find-by-agent-id.service';

module.exports = class TrainingTestService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async findByAgentId() {

        return await FindByAgentId.apply(this, arguments);
    }

};


