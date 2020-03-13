import _ from 'lodash';

const Routes = require('require-dir')('./rich-responses');

module.exports = [
    ..._.values(Routes)
];
