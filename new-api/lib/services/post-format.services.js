import Schmervice from 'schmervice';
import Create from './post-format/post-format.create.service';
import FindAllByIds from './post-format/post-format.find-all-by-ids.service';
import Remove from './post-format/post-format.remove.service';
import UpdateById from './post-format/post-format.update-by-id.service';

module.exports = class PostFormatService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async findAllByIds() {

        return await FindAllByIds.apply(this, arguments);
    }

    async updateById() {

        return await UpdateById.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }
};


