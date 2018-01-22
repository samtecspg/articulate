import { createSelector } from 'reselect';

const selectIntent = (state) => state.get('intent');

const makeSelectIntentData = () => createSelector(
  selectIntent,
  (intentState) => intentState.get('intentData').toJS(),
);

const makeSelectWindowSelection = () => createSelector(
  selectIntent,
  (intentState) => intentState.get('windowSelection'),
);

const makeSelectScenarioData = () => createSelector(
  selectIntent,
  (scenarioState) => scenarioState.get('scenarioData').toJS(),
);

export {
  selectIntent,
  makeSelectWindowSelection,
  makeSelectIntentData,
  makeSelectScenarioData,
};
