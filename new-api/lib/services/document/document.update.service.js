import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ id, data }) {

    const { es } = this.server.app;
    const { documentService } = await this.server.services();

    const DocumentModel = es[MODEL_DOCUMENT];
    try {

        const original = await documentService.findById({ id });
        const merged = {
            ...original,
            ...{ id: undefined },
            ...data
        };
        await DocumentModel.updateInstance({ id, data: merged });
        return { ...merged, ...{ id } };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
