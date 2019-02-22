import { performance } from 'perf_hooks';

export default function ({ fn, name }) {

    name = name || fn.name || 'tmp';
    if (process.env.PERF === 'true') {
        const tmp = {
            [name]: async function () {

                return await fn.apply(this, arguments);
            }
        };
        return performance.timerify(tmp[name]);
    }
    return fn;
}
