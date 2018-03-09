'use strict';

module.exports = (Handlebars) => {

    Handlebars.registerHelper('toJSON', (obj) => {

        return JSON.stringify(obj, null, 2);
    });
    return Handlebars;
};
