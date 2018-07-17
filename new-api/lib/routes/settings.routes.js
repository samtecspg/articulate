import _ from 'lodash';

const Routes = require('require-dir')('./settings');

module.exports = [
    ..._.values(Routes)
];
