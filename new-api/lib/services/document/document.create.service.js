import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ data }) {

    const { es } = this.server.app;

    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {

        const result = await DocumentModel.createInstance({ data });
        data.id = result._id;
        return data;
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
