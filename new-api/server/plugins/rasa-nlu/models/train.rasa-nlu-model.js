//import qs from 'querystring';
const config = {
    headers: {
        'Content-Type': 'application/x-yml'
    }
};
export const name = 'Train';
export const path = '/train';

export default ({ http }) => {

    return async ({ language, project, model, payload }) => {

        const response = await http.post(path, payload,
            {
                ...config,
                ...{
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
