/**
 * AgentPage selectors
 */

import { createSelector } from 'reselect';

const selectAgent = (state) => state.agentDetail;

const makeSelectAgentData = () => createSelector(
  selectAgent,
  (agentState) => agentState.agentData,
);

const makeSelectWebhookData = () => createSelector(
  selectAgent,
  (agentState) => agentState.webhookData,
);

const makeSelectPostFormatData = () => createSelector(
  selectAgent,
  (agentState) => agentState.postFormatData,
);

export {
  selectAgent,
  makeSelectAgentData,
  makeSelectWebhookData,
  makeSelectPostFormatData,
};
