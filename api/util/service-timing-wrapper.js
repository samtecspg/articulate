import fs from 'fs';
import { PERF } from './env';

const log = (text) => {

    const filename = 'performance-timing.csv';
    const logText = text + '\r\n';
    fs.appendFile(filename, logText, 'utf8', (err) => {

        if (err) {
            console.log(err);
        }
    });
};
export default function ({ type = 'Service', cls, fn, name }) {
    name = `${cls.constructor.name}.${name || 'tmp'}`;
    if (PERF) {

        const tmp = {
            [name]: async function () {

                const start = new Date();
                const result = await fn.apply(this, arguments);
                const end = new Date();
                const duration = end.getTime() - start.getTime();
                log(`${type},${name},${start.toISOString()},${end.toISOString()},${duration}`);
                return result;
            }
        };
        return tmp[name];
    }
    return fn;
}
