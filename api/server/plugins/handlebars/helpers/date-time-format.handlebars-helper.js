const Moment = require('moment');
export const name = 'Date Time Format (Moment)';

export default ({ Handlebars }) => {

    Handlebars.registerHelper('dateTimeFormat', (datetime, format, timezone = null) => {
        if (!timezone || !(typeof timezone === 'string' || timezone instanceof String)) {
            return Moment(datetime).format(format)
        } else {
            return Moment(datetime).tz(timezone).format(format)
        }
    });
};
