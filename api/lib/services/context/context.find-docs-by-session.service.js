import {
    MODEL_CONTEXT
} from '../../../util/constants';
import NotFoundErrorHandler from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId }) {

    const { redis } = this.server.app;
    const { documentService } = await this.server.services();
    const Model = await redis.factory(MODEL_CONTEXT);
    try {
        await Model.findBySessionId({ sessionId });

        if (Model.inDb) {

            const docs = await Promise.all(Model.property('docIds').map(async (docId) => {

                const doc = await documentService.findById({ id: docId });
                return doc;
            }));

            return docs;
        }

        return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
