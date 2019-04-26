import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ id, returnModel = false }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {
        const doc = await DocumentModel.findById({ id, refresh: true });
        if (returnModel) {
            return doc;
        }
        const docData = { id: doc._id, ...doc._source };
        docData.webhooks = JSON.parse(docData.webhooks);
        return docData;
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
