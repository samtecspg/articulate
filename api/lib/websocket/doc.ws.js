import {
    NOHM_SUB_SAVE,
    MODEL_DOCUMENT,
    ROUTE_DOCUMENT,
    ROUTE_AGENT
} from '../../util/constants';

module.exports = {
    subscribePath: `/${ROUTE_AGENT}/{id}/${ROUTE_DOCUMENT}`,
    isESModel: true
};
