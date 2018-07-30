import { createSelector } from 'reselect';

/**
 * Direct selector to the agentPage state domain
 */
const selectAgentPageDomain = (state) => state.agent;

/**
 * Other specific selectors
 */
const makeSelectAgent = () => createSelector(
    selectAgentPageDomain,
    (agentPageState) => {
        return agentPageState.agent;
    }
);

const makeSelectWebhook = () => createSelector(
    selectAgentPageDomain,
    (agentPageState) => {
        return agentPageState.webhook;
    }
);

const makeSelectPostFormat = () => createSelector(
    selectAgentPageDomain,
    (agentPageState) => {
        return agentPageState.postFormat;
    }
);

const makeSelectSettings = () => createSelector(
    selectAgentPageDomain,
    (agentPageState) => {
        return agentPageState.agentSettings;
    }
);


export {
    selectAgentPageDomain,
    makeSelectAgent,
    makeSelectWebhook,
    makeSelectPostFormat,
    makeSelectSettings,
};