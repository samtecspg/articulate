import {
    MODEL_AGENT,
    NOHM_SUB_SAVE,
    PARAM_AGENT_ID,
    ROUTE_AGENT
} from '../../util/constants';

module.exports = {
    model: MODEL_AGENT,
    subscribePath: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}`,
    publishPath: ({ properties }) => `/${ROUTE_AGENT}/${properties.id}`,
    actions: [NOHM_SUB_SAVE]
};
