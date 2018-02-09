import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');
const selectRoute = (state) => state.get('route');

const makeSelectAgents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agents'),
);

const makeSelectAgentDomains = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agentDomains'),
);

const makeSelectAgentEntities = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agentEntities'),
);

const makeSelectConversation = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('conversation').toJS(),
);

const makeSelectCurrentAgent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentAgent'),
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading'),
);

const makeSelectLoadingConversation = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loadingConversation'),
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error'),
);

const makeSelectSuccess = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('success'),
);

const makeSelectInWizard = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('inWizard'),
);

const makeSelectAgent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agentDetail'),
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
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

const makeSelectDomainIntents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('domainIntents'),
);


const makeSelectEntityIntents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('entityIntents').toJS(),
);

export {
  selectGlobal,
  makeSelectAgents,
  makeSelectAgentDomains,
  makeSelectAgentEntities,
  makeSelectConversation,
  makeSelectCurrentAgent,
  makeSelectLoading,
  makeSelectLoadingConversation,
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
};
