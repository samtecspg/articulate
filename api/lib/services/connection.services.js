import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Create from './connections/connection.create.service';
import Delete from './connections/connection.delete.service';
import Get from './connections/connection.get.service';
import Post from './connections/connection.post.service';
import UpdateById from './connections/connection.update-by-id.service';

module.exports = class ConnectionService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async post() {
        return await TimingWrapper({ cls: this, fn: Post, name: 'Post' }).apply(this, arguments);
    }

    async get() {
        return await TimingWrapper({ cls: this, fn: Get, name: 'Get' }).apply(this, arguments);
    }

    async delete() {
        return await TimingWrapper({ cls: this, fn: Delete, name: 'Delete' }).apply(this, arguments);
    }

    async updateById() {
        return await TimingWrapper({ cls: this, fn: UpdateById, name: 'UpdateById' }).apply(this, arguments);
    }

};


