import Axios from 'axios';
import QueryString from 'querystring';

module.exports = async ({ url, templatePayload, payloadType, method, templateContext }) => {

    const { handlebars } = this.server.app;

    try {
        const compiledUrl = handlebars.compile(url)(templateContext);
        let compiledPayload;
        let data = '';
        let contentType = '';

        if (payloadType !== 'None' && payloadType !== '') {
            compiledPayload = handlebars.compile(templatePayload)(templateContext);
        }

        if (compiledPayload) {
            if (payloadType === 'URL Encoded') {
                data = QueryString.stringify(JSON.parse(templatePayload));
                contentType = 'application/x-www-form-urlencoded';
            }
            else if (payloadType === 'JSON') {
                data = JSON.parse(compiledPayload);
                contentType = 'application/json';
            }
            else {
                data = compiledPayload;
                contentType = 'text/xml';
            }
        }
        const response = await Axios({
            method,
            url: compiledUrl,
            data,
            headers: { 'Content-Type': contentType },
            responseType: payloadType === 'XML' ? 'text' : 'json'
        });
        return response.data;
    }
    catch (error) {
        return { textResponse: 'We\'re having trouble fulfilling that request', actions: [] };
    }
};
