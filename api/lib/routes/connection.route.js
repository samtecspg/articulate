import _ from 'lodash';
import {
    ROUTE_CONNECTION
} from '../../util/constants';
import GlobalFindAll from './global/global.find-all.route';
import GlobalFindById from './global/global.find-by-id.route';

const Routes = require('require-dir')('./connections');

module.exports = [
    ..._.values(Routes),
    GlobalFindAll({ ROUTE: ROUTE_CONNECTION }),
    GlobalFindById({ ROUTE: ROUTE_CONNECTION }),
];
