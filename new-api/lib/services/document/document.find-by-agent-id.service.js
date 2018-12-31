import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ agentId }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {
        const results = await DocumentModel.search({
            body: {
                'sort': [
                    {
                        'time_stamp': {
                            'order': 'desc'
                        }
                    }
                ],
                'query': {
                    'match': {
                        'agent_id': agentId
                    }
                }
            }
        });
        if (results.hits.total === 0) {
            return [];
        }
        return results.hits.hits.map((result) => ({ id: result._id, ...result._source }));
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
