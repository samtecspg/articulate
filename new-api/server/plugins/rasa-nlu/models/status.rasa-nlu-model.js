export const name = 'Status';
export const path = '/status';

export default ({ http }) => {

    return async () => {

        const response = await http.get(path);
        return response.data;
    };
};
