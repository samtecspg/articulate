import { MODEL_DOCUMENT } from '../../../util/constants';
import ESErrorHandler from '../../errors/es.error-handler';

module.exports = async function ({ id, returnModel = false }) {

    const { es } = this.server.app;
    const DocumentModel = es.models[MODEL_DOCUMENT];
    try {
        const doc = await DocumentModel.findById({ id, refresh: true });
        if (returnModel) {
            if (doc && doc._source && doc._source.converseResult){
                doc._source.converseResult = JSON.parse(doc._source.converseResult);
            }
            return doc;
        }
        const docData = { id: doc._id, ...doc._source };
        if (docData.converseResult && docData.converseResult.CSO && docData.converseResult.CSO.webhooks){
            Object.keys(docData.converseResult.CSO.webhooks).forEach((webhookKey) => {

                if (docData.converseResult.CSO.webhooks[webhookKey].response){
                    docData.converseResult.CSO.webhooks[webhookKey].response = JSON.parse(docData.converseResult.CSO.webhooks[webhookKey].response);
                }
            });
        }
        if (docData.converseResult && docData.converseResult.responses){
            docData.converseResult.responses = docData.converseResult.responses.map((response) => {
                if (response.richResponses){
                    response.richResponses = JSON.parse(response.richResponses);
                }
                return response;
            });
        }
        if (docData.converseResult && docData.converseResult.richResponses){
            docData.converseResult.richResponses = JSON.parse(docData.converseResult.richResponses);
        }
        return docData;
    }
    catch (error) {
        throw ESErrorHandler({ error });
    }
};
