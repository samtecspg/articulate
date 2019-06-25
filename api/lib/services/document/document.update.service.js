import { MODEL_DOCUMENT, ROUTE_AGENT, ROUTE_DOCUMENT } from '../../../util/constants';
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
        await DocumentModel.updateInstance({ id, data: merged });
        const agentDocuments = await documentService.findByAgentId({ agentId: original.agent_id });
        this.server.publish(`/${ROUTE_AGENT}/${original.agent_id}/${ROUTE_DOCUMENT}`, agentDocuments);
        return { ...merged, ...{ id } };
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
