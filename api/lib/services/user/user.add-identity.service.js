import _ from 'lodash';
import {
    MODEL_USER_ACCOUNT,
    MODEL_USER_IDENTITY,
    PARAM_SECRET,
    PARAM_TOKEN
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, identityData, UserAccountModel = null, filterSensitiveData = false, returnModel = false }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    UserAccountModel = UserAccountModel || await globalService.findById({ id, model: MODEL_USER_ACCOUNT, returnModel: true });

    const model = await redis.factory(MODEL_USER_IDENTITY);
    try {
        await model.createInstance({ data: identityData });
        await UserAccountModel.link(model, MODEL_USER_IDENTITY);
        await UserAccountModel.save();
        let properties = model.allProperties();
        if (filterSensitiveData) {
            properties = _.omit(properties, [PARAM_SECRET, PARAM_TOKEN]);
        }
        return returnModel ? model : properties;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
