import Moment from 'moment';
import {
    MODEL_CATEGORY,
    STATUS_READY
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, agent = null, returnModel = false }) {

    const { redis } = this.server.app;
    data.status = STATUS_READY;
    data.lastTraining = Moment(data.lastTraining).utc().format();
    const CategoryModel = await redis.factory(MODEL_CATEGORY);
    try {
        await CategoryModel.createInstance({ data });
        if (agent) {
            await agent.link(CategoryModel, MODEL_CATEGORY);
            await agent.save();
        }
        return returnModel ? CategoryModel : CategoryModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
