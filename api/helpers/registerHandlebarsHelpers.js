'use strict';
const Moment = require('moment');
module.exports = (Handlebars) => {

    Handlebars.registerHelper('toJSON', (obj) => {

        return JSON.stringify(obj, null, 2);
    });

    Handlebars.registerHelper('dateTimeFormat', (datetime, format) => Moment(datetime).format(format));
    return Handlebars;
};
