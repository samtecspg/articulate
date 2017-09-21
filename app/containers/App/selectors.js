import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const makeSelectAgents = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('agents')
);

const makeSelectDomains = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('domains')
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

const makeSelectCurrentEntity = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentEntity')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
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
  makeSelectDomains,
  makeSelectCurrentAgent,
  makeSelectCurrentDomain,
  makeSelectCurrentIntent,
  makeSelectCurrentEntity,
  makeSelectLoading,
  makeSelectError,
  makeSelectAgent,
  makeSelectDomain,
  makeSelectIntent,
  makeSelectEntity,
  makeSelectLocationState,
};
