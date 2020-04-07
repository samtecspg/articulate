import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ id, indexId }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {
        await DocumentModel.removeInstance({ id, indexId });
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
