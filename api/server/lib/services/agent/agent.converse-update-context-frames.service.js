import _ from 'lodash';
import { MODEL_CONTEXT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, frames, requestId = null }) {

    const { redis } = this.server.app;
    const { frameService } = await this.server.services();

    try {
        const ContextModel = await redis.factory(MODEL_CONTEXT, id);
        const framesToUpdate = _.filter(frames, (frame) => {

            return !_.isNil(frame.id);
        });
        const framesToCreate = _.without(frames, ...framesToUpdate);

        await Promise.all(framesToUpdate.map(async (frame) => {

            const { id: frameId, ...data } = frame;
            return await frameService.update({ id: frameId, data, requestId });
        }));

        await Promise.all(framesToCreate.map(async (data) => {

            return await frameService.create({ data, context: ContextModel });
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
