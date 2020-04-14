import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './category/category.create.service';
import FindAllByIds from './category/category.find-all-by-ids.service';
import FindById from './category/category.find-by-id.service';
import GenerateTrainingData from './category/category.generate-training-data.service';
import Info from './category/category.info.service';
import LinkKeywords from './category/category.link-keywords.service';
import Remove from './category/category.remove.service';
import Train from './category/category.train.service';
import UnlinkKeywords from './category/category.unlink-keywords.service';

module.exports = class CategoryService extends Schmervice.Service {

    async info() {
        return await TimingWrapper({ cls: this, fn: Info, name: 'Info' }).apply(this, arguments);
    }

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async findAllByIds() {
        return await TimingWrapper({ cls: this, fn: FindAllByIds, name: 'FindAllByIds' }).apply(this, arguments);
    }

    async findById() {
        return await TimingWrapper({ cls: this, fn: FindById, name: 'FindById' }).apply(this, arguments);
    }

    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }

    async linkKeywords() {
        return await TimingWrapper({ cls: this, fn: LinkKeywords, name: 'LinkKeywords' }).apply(this, arguments);
    }

    async unlinkKeywords() {
        return await TimingWrapper({ cls: this, fn: UnlinkKeywords, name: 'UnlinkKeywords' }).apply(this, arguments);
    }

    async train() {
        return await TimingWrapper({ cls: this, fn: Train, name: 'Train' }).apply(this, arguments);
    }

    async generateTrainingData() {
        return await TimingWrapper({ cls: this, fn: GenerateTrainingData, name: 'GenerateTrainingData' }).apply(this, arguments);
    }
};


