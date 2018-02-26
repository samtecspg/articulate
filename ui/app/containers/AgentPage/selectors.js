/**
 * AgentPage selectors
 */

import { createSelector } from 'reselect';

const selectAgent = (state) => state.agent;

const makeSelectAgentData = () => createSelector(
  selectAgent,
  (agentState) => agentState.agentData,
);

const makeSelectWebhookData = () => createSelector(
  selectAgent,
  (agentState) => agentState.webhookData,
);

const makeSelectTouched = () => createSelector(
  selectAgent,
  (agentState) => agentState.touched,
);

export {
  selectAgent,
  makeSelectAgentData,
  makeSelectWebhookData,
  makeSelectTouched,
};
