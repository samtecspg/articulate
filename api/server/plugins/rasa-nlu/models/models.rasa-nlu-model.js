//import qs from 'querystring';
const config = {
    headers: {
        'Content-Type': 'application/x-yml'
    }
};
export const name = 'Models';
export const path = '/models';

export default ({ http }) => {

    return async ({ project, model, baseURL = null }) => {

        const response = await http.delete(path, { project, model }, { ...config, ...{ baseURL } });
        return response.data;
    };
};
