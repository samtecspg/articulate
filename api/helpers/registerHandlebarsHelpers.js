'use strict';
const Moment = require('moment');
const HandlebarsIntl = require('handlebars-intl');
const helpers = require('handlebars-helpers');

module.exports = (Handlebars) => {

    Handlebars.registerHelper('toJSON', (obj) => {

        return JSON.stringify(obj, null, 2);
    });

    Handlebars.registerHelper('dateTimeFormat', (datetime, format) => Moment(datetime).format(format));
    HandlebarsIntl.registerWith(Handlebars);

    const comparison = helpers.comparison({
        handlebars: Handlebars
    });
    return Handlebars;
};
