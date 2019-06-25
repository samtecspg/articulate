import {
    NOHM_SUB_SAVE,
    MODEL_DOCUMENT,
    ROUTE_AGENT,
    ROUTE_CONVERSE
} from '../../util/constants';

module.exports = {
    model: MODEL_DOCUMENT,
    subscribePath: `/${ROUTE_AGENT}/{id}/${ROUTE_CONVERSE}`,
    actions: [NOHM_SUB_SAVE],
    isResponse: true
};
