import _ from 'lodash';
import { ROUTE_ACCESS_CONTROL } from '../../util/constants';
import GlobalFindAll from './global/global.find-all.route';

const Routes = require('require-dir')('./access-control');

module.exports = [
    ..._.values(Routes),
    GlobalFindAll({ ROUTE: ROUTE_ACCESS_CONTROL })
];
