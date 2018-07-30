import { createSelector } from 'reselect';

/**
 * Direct selector to the agentsPage state domain
 */
const selectAgentsPageDomain = (state) => state.agents;

/**
 * Other specific selectors
 */
const makeSelectAgents = () => createSelector(
    selectAgentsPageDomain,
    (agentsPageState) => {
        return agentsPageState.agents;
    }
);

export {
    selectAgentsPageDomain,
    makeSelectAgents
};