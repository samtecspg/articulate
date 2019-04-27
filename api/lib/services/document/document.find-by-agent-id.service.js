import _ from 'lodash';
import util from 'util';
import {
    MODEL_DOCUMENT,
    SORT_DESC
} from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ agentId, direction = SORT_DESC, skip = 0, limit = 50, field = 'time_stamp' }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {
        const body = {
            'from': skip,
            'size': limit,
            'sort': [
                {
                    [field]: {
                        'order': direction.toLowerCase(),
                        'missing': 0
                    }
                }
            ],
            'query': {
                'match': {
                    'agent_id': agentId
                }
            }
        };

        const results = await DocumentModel.search({ body });
        if (results.hits.total === 0) {
            return { data: [], totalCount: 0 };
        }
        const data = results.hits.hits.map((result) => {

            const tempDocData = { ...result._source };
            if (tempDocData.converseResult){
                tempDocData.converseResult = JSON.parse(tempDocData.converseResult);
            }
            return { id: result._id, ...tempDocData }
        });

        return { data, totalCount: results.hits.total };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
