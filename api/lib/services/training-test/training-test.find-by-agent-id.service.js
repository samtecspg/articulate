import _ from 'lodash';
import util from 'util';
import {
    MODEL_TRAINING_TEST,
    SORT_DESC
} from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ agentId, direction = SORT_DESC, skip = 0, limit = 50, field = 'timeStamp', filter = null }) {

    const { es } = this.server.app;
    const TrainingTestModel = es.models[MODEL_TRAINING_TEST];
    try {
        const body = {
            from: skip,
            size: limit,
            sort: [
                {
                    [field]: {
                        order: direction.toLowerCase(),
                        missing: 0
                    }
                }
            ]
        };

        const matchAgentId = {
            match: {
                agentId
            }
        };

        let query = { "bool": { "must": [] } };
        query.bool.must.push(matchAgentId);
        body.query = query
        const bodyParam = body;

        const results = await TrainingTestModel.search({ bodyParam });
        const data = results.hits.hits;

        if (results.hits.total.value === 0) {
            return { data: [], totalCount: 0 };
        }

        return { data, totalCount: results.hits.total.value };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
