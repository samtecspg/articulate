import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const makeSelectAgents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agents')
);

const makeSelectAgentDomains = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agentDomains')
);

const makeSelectAgentEntities = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agentEntities')
);

const makeSelectConversation = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('conversation').toJS()
);

const makeSelectCurrentAgent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentAgent')
);

const makeSelectCurrentDomain = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentDomain')
);

const makeSelectCurrentIntent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentIntent')
);

const makeSelectCurrentScenario = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentScenario')
);

const makeSelectCurrentEntity = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentEntity')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectLoadingConversation = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loadingConversation')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectAgent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['agent', 'data'])
);

const makeSelectDomain = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['domain', 'data'])
);

const makeSelectIntent = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['intent', 'data'])
);

const makeSelectScenario = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['scenario', 'data'])
);

const makeSelectEntity = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['entity', 'data'])
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

export {
  selectGlobal,
  makeSelectAgents,
  makeSelectAgentDomains,
  makeSelectAgentEntities,
  makeSelectConversation,
  makeSelectCurrentAgent,
  makeSelectCurrentDomain,
  makeSelectCurrentIntent,
  makeSelectCurrentScenario,
  makeSelectCurrentEntity,
  makeSelectLoading,
  makeSelectLoadingConversation,
  makeSelectError,
  makeSelectAgent,
  makeSelectDomain,
  makeSelectIntent,
  makeSelectScenario,
  makeSelectEntity,
  makeSelectLocationState,
};
