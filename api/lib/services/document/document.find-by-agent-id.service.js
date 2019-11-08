import _ from 'lodash';
import util from 'util';
import {
    MODEL_DOCUMENT,
    SORT_DESC
} from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ agentId, direction = SORT_DESC, skip = 0, limit = 50, field = 'time_stamp', dateRange, filter = null }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];
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
                agent_id: agentId
            }
        };

        let query = { "bool": { "must": [] } };

        query.bool.must.push(matchAgentId);

        if (dateRange) {
            const dateRangeFilter = {
                range: {
                    time_stamp: {
                        gte: dateRange,
                        lte: 'now'
                    }
                }
            }
            query.bool.must.push(dateRangeFilter);
        }

        if (filter) {
            if (filter.query) {
                const queryFilter = {

                    "wildcard": {
                        "document": "*" + filter.query + "*"
                    },
                }
                query.bool.must.push(queryFilter);
            }

            let orQueryActionIntervals = { "bool": { "should": [] } };
            if (filter.actionIntervals) {
                orQueryActionIntervals.bool.should.push({
                    "bool": {
                        "must_not": {
                            "exists": {
                                "field": "maximum_action_score"
                            }
                        }
                    }
                });
                orQueryActionIntervals.bool.should.push({
                    "range": {
                        "maximum_action_score": {
                            "gte": Number(filter.actionIntervals[0]),
                            "lte": Number(filter.actionIntervals[1]),
                            "boost": 2.0
                        }
                    }
                });
                query.bool.must.push(orQueryActionIntervals);
            }

            let orQuery = { "bool": { "should": [] } };
            if (filter.actions) {
                filter.actions.map((action) => {
                    orQuery.bool.should.push(
                        {
                            "match": {
                                "recognized_action": action
                            }
                        }
                    )
                })
                query.bool.must.push(orQuery);
            }
        }

        body.query = query

        const results = await DocumentModel.search({ body });
        if (results.hits.total.value === 0) {
            return { data: [], totalCount: 0 };
        }
        const data = results.hits.hits.map((result) => {

            const tempDocData = { ...result._source };
            if (tempDocData.converseResult) {
                if (tempDocData.converseResult.CSO) {
                    if (tempDocData.converseResult.CSO.webhooks) {
                        if (tempDocData.converseResult.CSO.webhooks.response) {
                            Object.keys(tempDocData.converseResult.CSO.webhooks).forEach((webhookKey) => {
                                tempDocData.converseResult.CSO.webhooks[webhookKey].response = JSON.parse(tempDocData.converseResult.CSO.webhooks[webhookKey].response);
                            });
                        }
                    }
                }
            }
            return { id: result._id, ...tempDocData }
        });

        return { data, totalCount: results.hits.total.value };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
