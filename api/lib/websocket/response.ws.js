import {
    ROUTE_AGENT,
    ROUTE_CONVERSE
} from '../../util/constants';

module.exports = {
    subscribePath: `/${ROUTE_AGENT}/{id}/${ROUTE_CONVERSE}`,
    isResponse: true
};
