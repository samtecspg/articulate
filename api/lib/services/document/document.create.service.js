import { MODEL_DOCUMENT, ROUTE_DOCUMENT, ROUTE_AGENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ data }) {

    const { es } = this.server.app;
    const { documentService } = await this.server.services();

    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {
        const result = await DocumentModel.createInstance({ data });
        data.id = result._id;
        data.index = result._index;
        // We set a two second delay to wait for ES to have the Index refreshed
        setTimeout(() => {
            documentService.findByAgentId({ agentId: data.agent_id }).then((agentDocuments) => {
                this.server.publish(`/${ROUTE_AGENT}/${data.agent_id}/${ROUTE_DOCUMENT}`, agentDocuments);
            })
        }, 2000)
        return data;
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
