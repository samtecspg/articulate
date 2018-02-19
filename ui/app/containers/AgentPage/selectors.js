/**
 * AgentPage selectors
 */

import { createSelector } from 'reselect';

const selectAgent = (state) => state.agent;

const makeSelectAgentData = () => createSelector(
  selectAgent,
  (agentState) => agentState.agentData,
);

const makeSelectTouched = () => createSelector(
  selectAgent,
  (agentState) => agentState.touched,
);

export {
  selectAgent,
  makeSelectAgentData,
  makeSelectTouched,
};
