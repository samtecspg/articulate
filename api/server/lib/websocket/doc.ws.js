import {
    NOHM_SUB_SAVE,
    MODEL_DOCUMENT,
    ROUTE_DOCUMENT,
    ROUTE_AGENT
} from '../../util/constants';

module.exports = {
    model: MODEL_DOCUMENT,
    subscribePath: `/${ROUTE_AGENT}/{id}/${ROUTE_DOCUMENT}`,
    actions: [NOHM_SUB_SAVE],
    isESModel: true
};
