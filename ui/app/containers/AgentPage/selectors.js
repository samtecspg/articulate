/**
 * AgentPage selectors
 */

import { createSelector } from 'reselect';

const selectAgent = (state) => state.get('agent');

const makeSelectAgentData = () => createSelector(
  selectAgent,
  (agentState) => agentState.get('agentData').toJS(),
);

export {
  selectAgent,
  makeSelectAgentData,
};
