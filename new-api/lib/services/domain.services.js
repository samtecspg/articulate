import Schmervice from 'schmervice';
import Create from './domain/domain.create.service';
import FindAllByIds from './domain/domain.find-all-by-ids.service';
import FindById from './domain/domain.find-by-id.service';
import GenerateTrainingData from './domain/domain.generate-training-data.service';
import LinkKeywords from './domain/domain.link-keywords.service';
import Remove from './domain/domain.remove.service';
import Train from './domain/domain.train.service';
import UnlinkKeywords from './domain/domain.unlink-keywords.service';

module.exports = class DomainService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async findAllByIds() {

        return await FindAllByIds.apply(this, arguments);
    }

    async findById() {

        return await FindById.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

    async linkKeywords() {

        return await LinkKeywords.apply(this, arguments);
    }

    async unlinkKeywords() {

        return await UnlinkKeywords.apply(this, arguments);
    }

    async train() {

        return await Train.apply(this, arguments);
    }

    async generateTrainingData() {

        return await GenerateTrainingData.apply(this, arguments);
    }
};


