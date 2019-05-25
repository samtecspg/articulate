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
        let compiledPayload, compiledUsername, compiledPassword;
        let data = '';
        let contentType = '';

        if (username) {
            compiledUsername = handlebars.compile(username)(templateContext)
            compiledPassword = handlebars.compile(password)(templateContext)
        }

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
                username: compiledUsername,
                password: compiledPassword
            } : undefined
        });
        endTime = new Moment();
        const elapsed_time_ms = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
        return {
            response: response.data,
            elapsed_time_ms,
            statusCode: response.status
        };
    }
    catch (error) {
        console.log(error);
        endTime = new Moment();
        const elapsed_time_ms = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
        if (error.response && error.response.data){
            return {
                error: error.response.data,
                elapsed_time_ms,
                statusCode: error.response.status
            };
        }
        return { textResponse: 'We\'re having trouble fulfilling that request', actions: [] };
    }
};
