import _ from 'lodash';
import { MODEL_CONTEXT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async ({ id, frames }) => {

    const { redis } = this.server.app;
    const { frameService } = await this.server.services();

    try {
        const ContextModel = await redis.factory(MODEL_CONTEXT, id);
        const framesToUpdate = _.map(frames, 'id');
        const framesToCreate = _.without(frames, ...framesToUpdate);

        await Promise.all(framesToUpdate.map(({ id: frameId, ...data }) => {

            return frameService.update({ id: frameId, data });
        }));

        await Promise.all(framesToCreate.map((data) => {

            return frameService.create({ data, context: ContextModel });
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
