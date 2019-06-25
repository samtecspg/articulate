//import qs from 'querystring';
const config = {
    headers: {
        'Content-Type': 'application/x-yml'
    },
    maxContentLength: Infinity
};
export const name = 'Train';
export const path = '/train';

export default ({ http }) => {

    return async ({ language, project, model, payload, baseURL = null }) => {

        const response = await http.post(path, payload,
            {
                ...config,
                ...{
                    baseURL,
                    params: {
                        language,
                        project,
                        model
                    }
                }
            });
        return response.data;
    };
};
