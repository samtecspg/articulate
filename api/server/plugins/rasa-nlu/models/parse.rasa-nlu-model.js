export const name = 'Parse';
export const path = '/parse';

export default ({ http }) => {

    return async ({ q, project, model, baseURL = null }) => {

        var hrstart = process.hrtime()

        const response = await http.post(path, { q, project, model }, { baseURL });

        var hrend = process.hrtime(hrstart)

        console.info('%f Rasa parse execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        return response.data;
    };
};
