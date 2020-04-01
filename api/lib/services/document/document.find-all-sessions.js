import { MODEL_DOCUMENT, ROUTE_DOCUMENT, ROUTE_AGENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ agentId }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];

    try {

        const body = {
            size: 0,
            query: {
                bool: {
                    must: [
                        { match: { agent_id: agentId } }
                    ]
                }
            },
            aggs: {
                sessions_count: {
                    terms: {
                        field: "session",
                        "size": 10000
                    }
                }
            }
        }


        const bodyParam = body;
        const results = await DocumentModel.search({ bodyParam });
        if (results.aggregations.sessions_count.buckets.length === 0) {
            return { data: [], totalCount: 0 };
        } else {
            return { data: results.aggregations.sessions_count.buckets.map(bucket => { return bucket.key }), totalCount: results.aggregations.sessions_count.buckets.length }
        }

    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
