import Moment from 'moment';
import {
    MODEL_DOMAIN,
    STATUS_READY
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, agent = null, returnModel = false }) {

    const { redis } = this.server.app;
    data.status = STATUS_READY;
    data.lastTraining = Moment(data.lastTraining).utc().format();
    const DomainModel = await redis.factory(MODEL_DOMAIN);
    try {
        await DomainModel.createInstance({ data });
        if (agent) {
            await agent.link(DomainModel, MODEL_DOMAIN);
            await agent.save();
        }
        return returnModel ? DomainModel : DomainModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
