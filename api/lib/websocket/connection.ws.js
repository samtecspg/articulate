import {
    ROUTE_EXTERNAL,
    ROUTE_CONNECTION
} from '../../util/constants';

module.exports = {
    subscribePath: `/${ROUTE_CONNECTION}/{id}/${ROUTE_EXTERNAL}`,
    isConnection: true
};
