import {
    MODEL_CONNECTION
} from '../../../util/constants';
import NotFoundError from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, data, returnModel = false }) {

    const { redis } = this.server.app;
    try {
        const  ConnectionModel = await redis.factory(MODEL_CONNECTION, id);
        if (! ConnectionModel.isLoaded) {
            return Promise.reject(NotFoundError({ id, model: MODEL_CONNECTION }));
        }

        await  ConnectionModel.updateInstance({ data });
        return returnModel ?  ConnectionModel :  ConnectionModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
