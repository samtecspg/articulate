import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import AddIdentity from './user/user.add-identity.service';
import AuthorizeOauth from './user/user.authorize-oauth.service';
import Create from './user/user.create-account.service';
import FindById from './user/user.find-by-id.service';
import RemoveById from './user/user.remove-by-id.service';
import Validate from './user/user.validate.service';

class UserService extends Schmervice.Service {
    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async findById() {
        return await TimingWrapper({ cls: this, fn: FindById, name: 'FindById' }).apply(this, arguments);
    }

    async removeById() {
        return await TimingWrapper({ cls: this, fn: RemoveById, name: 'RemoveById' }).apply(this, arguments);
    }

    async addIdentity() {
        return await TimingWrapper({ cls: this, fn: AddIdentity, name: 'AddIdentity' }).apply(this, arguments);
    }

    async validate() {
        return await TimingWrapper({ cls: this, fn: Validate, name: 'Validate' }).apply(this, arguments);
    }

    async authorizeOauth() {
        return await TimingWrapper({ cls: this, fn: AuthorizeOauth, name: 'AuthorizeOauth' }).apply(this, arguments);
    }
}

module.exports = UserService;
