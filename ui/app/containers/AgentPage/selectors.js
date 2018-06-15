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

const makeSelectPostFormatData = () => createSelector(
  selectAgent,
  (agentState) => agentState.postFormatData,
);

const makeSelectOldAgentData = () => createSelector(
  selectAgent,
  (agentState) => agentState.oldAgentData,
);

const makeSelectOldWebhookData = () => createSelector(
  selectAgent,
  (agentState) => agentState.oldWebhookData,
);

const makeSelectTouched = () => createSelector(
  selectAgent,
  (agentState) => agentState.touched,
);

const makeSelectAgentSettingsData = () => createSelector(
  selectAgent,
  (agentState) => agentState.agentSettingsData,
);

export {
  selectAgent,
  makeSelectAgentData,
  makeSelectWebhookData,
  makeSelectOldAgentData,
  makeSelectOldWebhookData,
  makeSelectTouched,
  makeSelectPostFormatData,
  makeSelectAgentSettingsData
};
