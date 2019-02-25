import log from 'log-to-file';
import moment from 'moment';

export default function ({ fn, name }) {

    name = name || fn.name || 'tmp';
    if (process.env.PERF === 'true') {

        const tmp = {
            [name]: async function () {

                const start = new moment();
                const result = await fn.apply(this, arguments);
                const end = new moment();
                const duration = moment.duration(end.diff(start)).asMilliseconds();
                log(`${name},${duration}`);
                return result;
            }
        };
        return tmp[name];
    }
    return fn;
}
