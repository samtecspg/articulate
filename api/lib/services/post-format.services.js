import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './post-format/post-format.create.service';
import FindAllByIds from './post-format/post-format.find-all-by-ids.service';
import Remove from './post-format/post-format.remove.service';
import UpdateById from './post-format/post-format.update-by-id.service';

module.exports = class PostFormatService extends Schmervice.Service {
    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async findAllByIds() {
        return await TimingWrapper({ cls: this, fn: FindAllByIds, name: 'FindAllByIds' }).apply(this, arguments);
    }

    async updateById() {
        return await TimingWrapper({ cls: this, fn: UpdateById, name: 'UpdateById' }).apply(this, arguments);
    }

    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }
};
