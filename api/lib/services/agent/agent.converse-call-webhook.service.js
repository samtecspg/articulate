import Axios from 'axios';
import QueryString from 'querystring';
import Moment from 'moment';

const getHeaders = (headers, contentType) => {

    const result = {};
    let userSpecifiedContentType = false;
    headers.forEach((header) => {

        result[header.key] = header.value;
        if (header.key.toUpperCase() === 'Content-Type'.toUpperCase()){
            userSpecifiedContentType = true;
        }
    });
    if (!userSpecifiedContentType && contentType){
        result['Content-Type'] = contentType;
    }
    return result;
};

module.exports = async function ({ url, templatePayload, payloadType, method, templateContext, headers, username, password }) {

    const { handlebars } = this.server.app;
    let startTime, endTime;

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
        startTime = new Moment();
        const response = await Axios({
            method,
            url: compiledUrl,
            data,
            headers: getHeaders(headers, contentType),
            responseType: payloadType === 'XML' ? 'text' : 'json',
            auth: username ? {
                username,
                password
            } : undefined
        });
        endTime = new Moment();
        const elapsed_time_ms = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
        if (typeof response.data === 'string'){
            return {
                text: response.data,
                elapsed_time_ms
            }
        }
        return {
            ...response.data,
            elapsed_time_ms
        };
    }
    catch (error) {
        endTime = new Moment();
        const elapsed_time_ms = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
        if (error.response && error.response.data){
            if (typeof error.response.data === 'string'){
                return {
                    text: error.response.data,
                    elapsed_time_ms,
                    statusCode: error.response.status
                }
            }
            delete error.response.data.statusCode;
            return {
                ...error.response.data,
                elapsed_time_ms,
                statusCode: error.response.status
            };
        }
        return { textResponse: 'We\'re having trouble fulfilling that request', actions: [] };
    }
};
