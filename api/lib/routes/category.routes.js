import _ from 'lodash';

const Routes = require('require-dir')('./category');

module.exports = [
    ..._.values(Routes)
];
