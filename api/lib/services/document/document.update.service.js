import { MODEL_DOCUMENT, ROUTE_AGENT, ROUTE_DOCUMENT, PARAM_SEARCH } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';
import _ from 'lodash';

module.exports = async function ({ id, data }) {

    const { es } = this.server.app;
    const { documentService } = await this.server.services();

    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {

        const original = await documentService.findById({ id });
        const merged = {
            ...original,
            ...{ id: undefined },
            ...data
        };
        if (merged.converseResult && merged.converseResult.CSO && merged.converseResult.CSO.webhooks) {
            Object.keys(merged.converseResult.CSO.webhooks).forEach((webhookKey) => {
                if (merged.converseResult.CSO.webhooks[webhookKey].response) {
                    merged.converseResult.CSO.webhooks[webhookKey].response = JSON.stringify(merged.converseResult.CSO.webhooks[webhookKey].response);
                } else if (merged.converseResult.CSO.webhooks[webhookKey].error) {
                    merged.converseResult.CSO.webhooks[webhookKey].error = JSON.stringify(merged.converseResult.CSO.webhooks[webhookKey].error);
                }
            });
        }
        await DocumentModel.updateInstance({ id, data: merged });
        this.server.publish(`/${ROUTE_AGENT}/${original.agent_id}/${ROUTE_DOCUMENT}/${PARAM_SEARCH}`, {});
        return { ...merged, ...{ id } };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
