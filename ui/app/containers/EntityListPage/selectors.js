import { createSelector } from 'reselect';

const selectAgent = (state) => state.agent;

const makeSelectAgentData = () => createSelector(
  selectAgent,
  (agentState) => agentState.agentData,
);

export {
  selectAgent,
  makeSelectAgentData,
};
