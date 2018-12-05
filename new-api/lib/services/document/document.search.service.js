import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ body }) {

    const { es } = this.server.app;
    const DocumentModel = es[MODEL_DOCUMENT];
    try {
        return await DocumentModel.search({ body });
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
