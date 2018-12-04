import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ id, returnModel = false }) {

    const { es } = this.server.app;
    const DocumentModel = es[MODEL_DOCUMENT];
    try {
        const doc = await DocumentModel.findById({ id, refresh: true });
        if (returnModel) {
            return doc;
        }
        const properties = doc._source;
        properties.id = doc._id;
        return properties;
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
