import Schmervice from 'schmervice';
import Create from './training-test/training-test.create.service';

module.exports = class TrainingTestService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

};


