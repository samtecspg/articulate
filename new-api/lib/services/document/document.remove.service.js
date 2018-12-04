import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ id }) {

    const { es } = this.server.app;
    const DocumentModel = es[MODEL_DOCUMENT];
    try {
        await DocumentModel.removeInstance({ id });
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
