const Moment = require('moment');
export const name = 'Date Time Format (Moment)';

export default ({ Handlebars }) => {

    Handlebars.registerHelper('dateTimeFormat', (datetime, format) => Moment(datetime).format(format));
};
