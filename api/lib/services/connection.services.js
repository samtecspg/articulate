import Schmervice from 'schmervice';
import Create from './connections/connection.create.service';
import Post from './connections/connection.post.service';
import Get from './connections/connection.get.service';
import Delete from './connections/connection.delete.service';
import UpdateById from './connections/connection.update-by-id.service';

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
    
    async updateById() {

        return await UpdateById.apply(this, arguments);
    }

};


