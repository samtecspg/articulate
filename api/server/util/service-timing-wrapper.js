import fs from 'fs';
import moment from 'moment';

const log = (text) => {

    const filename = 'performance-timing.csv';
    const logText = text + '\r\n';
    fs.appendFile(filename, logText, 'utf8', (err) => {

        if (err) {
            console.log(err);
        }
    });
};
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
