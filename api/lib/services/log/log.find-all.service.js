import _ from 'lodash';
import util from 'util';
import {
    MODEL_LOG,
    SORT_DESC
} from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ direction = SORT_DESC, skip = 0, limit = 50, field = '@timestamp', filter = null }) {

    const { es } = this.server.app;
    const LogModel = es.models[MODEL_LOG];
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

        let orQueryContainers = { "bool": { "should": [] } };
        if (filter && filter.containers) {
            filter.containers.map((container) => {
                orQueryContainers.bool.should.push(
                    {
                        "wildcard": {
                            "container.name": '*' + container + '*'
                        }
                    }
                )
            })
            body.query = orQueryContainers;
        }

        const bodyParam = body;
        const results = await LogModel.search({ bodyParam });
        if (results.hits.total.value === 0) {
            return { data: [], totalCount: 0 };
        }
        const data = results.hits.hits;

        return { data, totalCount: results.hits.total.value };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
