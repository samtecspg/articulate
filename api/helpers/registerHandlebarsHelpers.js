'use strict';
const Moment = require('moment');
const HandlebarsIntl = require('handlebars-intl');
const helpers = require('handlebars-helpers');

const buildListOfWords = (words, separator) => {

    if (words.length === 1){
        return words[0];
    }
    if (words.length === 2){
        return words[0] + ' ' + separator + ' ' + words[1];
    }
    return words.slice(0,words.length - 1).join(', ') + ', ' + separator + ' ' + words[words.length -1];
};

module.exports = (Handlebars) => {

    Handlebars.registerHelper('toJSON', (obj) => {

        return JSON.stringify(obj, null, 2);
    });

    Handlebars.registerHelper('andList', (words) => {

        return buildListOfWords(words, 'and');
    });

    Handlebars.registerHelper('orList', (words) => {

        return buildListOfWords(words, 'or');
    });

    Handlebars.registerHelper('dateTimeFormat', (datetime, format) => Moment(datetime).format(format));
    HandlebarsIntl.registerWith(Handlebars);

    helpers(['array', 'collection', 'comparison', 'inflection', 'math', 'misc', 'number', 'object', 'string', 'url'], {
        handlebars: Handlebars
    });
    return Handlebars;
};
