import _ from 'lodash';

const RequireDir = require('require-dir');
const dir = RequireDir('.', { recurse: true});

module.exports = dir
