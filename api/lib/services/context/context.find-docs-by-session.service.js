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

                let splitArray = docId.split('_+_');
                let id = splitArray[0];
                let indexId = splitArray.length > 0 ? splitArray[1] : null;
                const doc = await documentService.findById({ id, indexId });
                return doc;
            }));

            return docs.filter((doc) => { return doc });
        }

        return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
