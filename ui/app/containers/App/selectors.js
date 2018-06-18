import _ from 'lodash';
import { createSelector } from 'reselect';

const selectGlobal = (state) => {
  return state.global;
};
const selectRoute = (state) => {
  return state.routing;
};

const makeSelectAgents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.agents,
);

const makeSelectAgentDomains = () => createSelector(
  selectGlobal,
  (globalState) => globalState.agentDomains,
);

const makeSelectAgentEntities = () => createSelector(
  selectGlobal,
  (globalState) => globalState.agentEntities,
);

const makeSelectConversation = () => createSelector(
  selectGlobal,
  (globalState) => globalState.conversation,
);

const makeSelectCurrentAgent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.currentAgent,
);

const makeSelectCurrentAgentStatus = () => createSelector(
  selectGlobal,
  (globalState) => globalState.currentAgentStatus
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.loading,
);

const makeSelectLoadingConversation = () => createSelector(
  selectGlobal,
  (globalState) => globalState.loadingConversation,
);

const makeSelectMissingAPI = () => createSelector(
  selectGlobal,
  (globalState) => globalState.missingAPI,
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.error,
);

const makeSelectSuccess = () => createSelector(
  selectGlobal,
  (globalState) => globalState.success,
);

const makeSelectInWizard = () => createSelector(
  selectGlobal,
  (globalState) => globalState.inWizard,
);

const makeSelectAgent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.agentDetail,
);

const makeSelectDomain = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['domain', 'data']),
);

const makeSelectWebhook = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['webhook', 'data']),
);

const makeSelectIntent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['intent', 'data']),
);

const makeSelectScenario = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['scenario', 'data']),
);

const makeSelectEntity = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['entity', 'data']),
);
const makeSelectRoute = () => createSelector(
  selectRoute,
  (routeState) => routeState,
);

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.routing; // or state.route

    if (!_.isEqual(prevRoutingState, routingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState;
    }

    return prevRoutingStateJS;
  };
};

const makeSelectDomainIntents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.domainIntents,
);

const makeSelectEntityIntents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.entityIntents,
);

const makeSelectSettingsData = () => createSelector(
  selectGlobal,
  (globalState) => globalState.settingsData,
);

export {
  selectGlobal,
  makeSelectAgents,
  makeSelectAgentDomains,
  makeSelectAgentEntities,
  makeSelectConversation,
  makeSelectCurrentAgent,
  makeSelectCurrentAgentStatus,
  makeSelectLoading,
  makeSelectLoadingConversation,
  makeSelectMissingAPI,
  makeSelectError,
  makeSelectSuccess,
  makeSelectInWizard,
  makeSelectAgent,
  makeSelectDomain,
  makeSelectWebhook,
  makeSelectIntent,
  makeSelectScenario,
  makeSelectEntity,
  makeSelectLocationState,
  makeSelectDomainIntents,
  makeSelectRoute,
  makeSelectEntityIntents,
  makeSelectSettingsData,
};
