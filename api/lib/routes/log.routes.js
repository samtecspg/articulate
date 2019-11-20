import _ from 'lodash';

import {
    ROUTE_LOG
} from '../../util/constants';
import GlobalFindAll from './global/global.find-all.route';

const Routes = require('require-dir')('./log');


module.exports = [
    ..._.values(Routes)
];
