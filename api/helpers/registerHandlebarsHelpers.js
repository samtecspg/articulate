'use strict';
const Moment = require('moment');
const Json2Xml = require('json2xml');
const HandlebarsIntl = require('handlebars-intl');
const Helpers = require('handlebars-helpers');
const Numeral = require('numeral');
const _ = require('lodash');

_.assign(Numeral.localeData('en'), {
    abbreviations: {
        thousand: "K",
        million: "M",
        billion: "B",
        trillion: "T"
    }
});

const buildListOfWords = (words, separator) => {

    if (!Array.isArray(words)){
        return words;
    }
    if (words.length === 1){
        return words[0];
    }
    if (words.length === 2){
        return words[0] + ' ' + separator + ' ' + words[1];
    }
    return words.slice(0, words.length - 1).join(', ') + ', ' + separator + ' ' + words[words.length - 1];
};

module.exports = (Handlebars) => {

    Handlebars.registerHelper('andList', (words) => {

        return buildListOfWords(words, 'and');
    });

    Handlebars.registerHelper('orList', (words) => {

        return buildListOfWords(words, 'or');
    });

    Handlebars.registerHelper('toXML', (obj) => {

        return Json2Xml(obj);
    });

    Handlebars.registerHelper('numeral', (number, format) => {
        return Numeral(number).format(format);
    });

    Handlebars.registerHelper('dateTimeFormat', (datetime, format) => Moment(datetime).format(format));
    HandlebarsIntl.registerWith(Handlebars);

    Helpers(['array', 'collection', 'comparison', 'inflection', 'math', 'misc', 'number', 'object', 'string', 'url'], {
        handlebars: Handlebars
    });
    return Handlebars;
};
