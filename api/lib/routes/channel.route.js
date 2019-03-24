import _ from 'lodash';

const Routes = require('require-dir')('./channels');

module.exports = [
    ..._.values(Routes)
];
