import { MODEL_TRAINING_TEST, ROUTE_DOCUMENT, ROUTE_AGENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ data }) {

    const { es } = this.server.app;
    const { documentService } = await this.server.services();

    const TrainingTestModel = es.models[MODEL_TRAINING_TEST];
    try {
        const result = await TrainingTestModel.createInstance({ data });
        return data;
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
