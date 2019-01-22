import qs from 'querystring';

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: 'force'
};
export const name = 'Parse';
export const path = '/parse';

export default ({ http }) => {

    return async ({ payload, baseURL = null }) => {

        const response = await http.post(path, qs.stringify(payload),
            {
                ...config,
                ...{ baseURL }
            });
        return response.data;
    };
};
