import _ from 'lodash';

const Routes = require('require-dir')('./server');

module.exports = [
    ..._.values(Routes)
];
