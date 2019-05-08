const { JSONPath } = require('jsonpath-plus');

export const name = 'JSONPath';

export default ({ Handlebars }) => {

    Handlebars.registerHelper('JSONPath', (json, path) => {
      return JSONPath({ path, json });
    });
};
