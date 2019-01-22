import Schmervice from 'schmervice';
import Create from './category/category.create.service';
import FindAllByIds from './category/category.find-all-by-ids.service';
import FindById from './category/category.find-by-id.service';
import GenerateTrainingData from './category/category.generate-training-data.service';
import LinkKeywords from './category/category.link-keywords.service';
import Remove from './category/category.remove.service';
import Train from './category/category.train.service';
import UnlinkKeywords from './category/category.unlink-keywords.service';

module.exports = class CategoryService extends Schmervice.Service {

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


