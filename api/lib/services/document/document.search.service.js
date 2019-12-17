import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ bodyParam }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {
        var res = await DocumentModel.search({ bodyParam });
        return res;
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
