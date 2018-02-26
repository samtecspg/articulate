/**
 * AgentPage selectors
 */

import { createSelector } from 'reselect';

const selectAgent = (state) => state.get('agentDetail');

const makeSelectAgentData = () => createSelector(
  selectAgent,
  (agentState) => agentState.get('agentData').toJS(),
);

const makeSelectWebhookData = () => createSelector(
  selectAgent,
  (agentState) => agentState.get('webhookData').toJS(),
);

export {
  selectAgent,
  makeSelectAgentData,
  makeSelectWebhookData,
};
