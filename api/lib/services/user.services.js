import Schmervice from 'schmervice';
import AddIdentity from './user/user.add-identity.service';
import AuthorizeOauth from './user/user.authorize-oauth.service';
import Create from './user/user.create-account.service';
import FindById from './user/user.find-by-id.service';
import Validate from './user/user.validate.service';

module.exports = class UserService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async findById() {
        return await FindById.apply(this, arguments);
    }

    async addIdentity() {

        return await AddIdentity.apply(this, arguments);
    }

    async validate() {

        return await Validate.apply(this, arguments);
    }

    async authorizeOauth() {

        return await AuthorizeOauth.apply(this, arguments);
    }
};
