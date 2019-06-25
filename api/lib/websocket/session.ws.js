import {
    MODEL_CONTEXT,
    NOHM_SUB_SAVE,
    ROUTE_CONTEXT,
    PARAM_SESSION,
} from '../../util/constants';

module.exports = {
    model: MODEL_CONTEXT,
    subscribePath: `/${ROUTE_CONTEXT}`,
    publishPath: () => `/${ROUTE_CONTEXT}`,
    actions: [NOHM_SUB_SAVE]
};
