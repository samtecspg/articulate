import { createSelector } from 'reselect';

const selectIntent = (state) => state.get('intent');

const makeSelectIntentData = () => createSelector(
  selectIntent,
  (intentState) => intentState.get('intentData').toJS(),
);

const makeSelectScenarioData = () => createSelector(
  selectIntent,
  (scenarioState) => scenarioState.get('scenarioData').toJS(),
);

export {
  selectIntent,
  makeSelectIntentData,
  makeSelectScenarioData,
};
