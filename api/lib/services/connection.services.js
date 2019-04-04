import Schmervice from 'schmervice';
import Create from './connections/connection.create.service';
import Post from './connections/connection.post.service';
import Get from './connections/connection.get.service';
import Delete from './connections/connection.delete.service';
// import FindByName from './settings/settings.find-by-name.service';
// import UpdateByName from './settings/settings.update-by-name.service';
// import BulkCreate from './settings/settings.bulk-create-settings.service';
// import BulkUpdate from './settings/settings.bulk-update-settings.service';

module.exports = class ConnectionService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async post() {

        return await Post.apply(this, arguments);
    }

    async get() {

        return await Get.apply(this, arguments);
    }

    async delete() {

        return await Delete.apply(this, arguments);
    }

    // async updateByName() {

    //     return await UpdateByName.apply(this, arguments);
    // }

    // async bulkCreate() {

    //     return await BulkCreate.apply(this, arguments);
    // }

    // async bulkUpdate() {

    //     return await BulkUpdate.apply(this, arguments);
    // }

};


