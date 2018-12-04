import _ from 'lodash';

const Routes = require('require-dir')('./document');

module.exports = [
    ..._.values(Routes)
];
