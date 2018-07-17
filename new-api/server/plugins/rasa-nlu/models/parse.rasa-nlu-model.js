export const name = 'Parse';
export const path = '/parse';

export default ({ http }) => {

    return async ({ q, project, model, baseURL = null }) => {

        const response = await http.post(path, { q, project, model }, { baseURL });
        return response.data;
    };
};
