import { MODEL_LOG } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ bodyParam }) {

    const { es } = this.server.app;
    const LogModel = es.models[MODEL_LOG];
    try {
        return await LogModel.search({ bodyParam });
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
