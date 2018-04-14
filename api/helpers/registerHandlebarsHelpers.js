'use strict';
const Moment = require('moment');
const Json2Xml = require('json2xml');
const HandlebarsIntl = require('handlebars-intl');
const helpers = require('handlebars-helpers');

module.exports = (Handlebars) => {

    Handlebars.registerHelper('toJSON', (obj) => {

        const jsonValue = JSON.stringify(obj, null, 2)
        return jsonValue;
    });

    Handlebars.registerHelper('toXML', (obj) => {

        return Json2Xml(obj);
    });

    Handlebars.registerHelper('dateTimeFormat', (datetime, format) => Moment(datetime).format(format));
    HandlebarsIntl.registerWith(Handlebars);

    const comparison = helpers.comparison({
        handlebars: Handlebars
    });
    return Handlebars;
};
