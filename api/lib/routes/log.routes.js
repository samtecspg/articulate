import _ from 'lodash';
const Routes = require('require-dir')('./log');

module.exports = [
    ..._.values(Routes)
];
