import _ from 'lodash';

const Routes = require('require-dir')('./context');

module.exports = [
    ..._.values(Routes)
];
