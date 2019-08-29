import _ from 'lodash';
import util from 'util';
import {
    MODEL_DOCUMENT,
    SORT_DESC
} from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ agentId, direction = SORT_DESC, skip = 0, limit = 50, field = 'time_stamp', dateRange }) {

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
        
        body.query = dateRange ? {
            bool: {
                must: [
                    matchAgentId,
                    {
                        range: {
                            time_stamp : {
                                gte : dateRange,
                                lte :  'now'
                            }
                        }
                    }
                ]
            }
        } : matchAgentId;

        const results = await DocumentModel.search({ body });
        if (results.hits.total === 0) {
            return { data: [], totalCount: 0 };
        }
        const data = results.hits.hits.map((result) => {

            const tempDocData = { ...result._source };
            if (tempDocData.converseResult){
                if (tempDocData.converseResult.CSO){
                    if (tempDocData.converseResult.CSO.webhooks){
                        if (tempDocData.converseResult.CSO.webhooks.response){
                            Object.keys(tempDocData.converseResult.CSO.webhooks).forEach((webhookKey) => {
                                tempDocData.converseResult.CSO.webhooks[webhookKey].response = JSON.parse(tempDocData.converseResult.CSO.webhooks[webhookKey].response);
                            });
                        }
                    }
                }
            }
            return { id: result._id, ...tempDocData }
        });

        return { data, totalCount: results.hits.total };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
