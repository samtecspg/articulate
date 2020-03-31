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

        var hrstart = process.hrtime()

        const response = await http.post(path, qs.stringify(payload),
            {
                ...config,
                ...{ baseURL }
            });

        var hrend = process.hrtime(hrstart)

        console.info('%f Duckling parse execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        return response.data;
    };
};
