export const name = 'Status';
export const path = '/status';

export default ({ http }) => {

    return async ({ baseURL = null }) => {

        const response = await http.get(path, { baseURL });
        return response.data;
    };
};
