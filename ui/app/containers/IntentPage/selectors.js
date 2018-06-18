import { createSelector } from 'reselect';

const selectIntent = (state) => state.intent;

const makeSelectIntentData = () => createSelector(
  selectIntent,
  (intentState) => intentState.intentData,
);

const makeSelectScenarioData = () => createSelector(
  selectIntent,
  (scenarioState) => scenarioState.scenarioData,
);

const makeSelectWebhookData = () => createSelector(
  selectIntent,
  (scenarioState) => scenarioState.webhookData,
);

const makeSelectPostFormatData = () => createSelector(
  selectIntent,
  (intentState) => intentState.postFormatData,
);

const makeSelectOldIntentData = () => createSelector(
  selectIntent,
  (intentState) => intentState.oldIntent,
);

const makeSelectOldScenarioData = () => createSelector(
  selectIntent,
  (scenarioState) => scenarioState.oldScenario,
);

const makeSelectOldWebhookData = () => createSelector(
  selectIntent,
  (scenarioState) => scenarioState.oldWebhook,
);

const makeSelectWindowSelection = () => createSelector(
  selectIntent,
  (intentState) => intentState.windowSelection,
);

const makeSelectTouched = () => createSelector(
  selectIntent,
  (intentState) => intentState.touched,
);

export {
  selectIntent,
  makeSelectWindowSelection,
  makeSelectIntentData,
  makeSelectScenarioData,
  makeSelectWebhookData,
  makeSelectOldIntentData,
  makeSelectOldScenarioData,
  makeSelectOldWebhookData,
  makeSelectTouched,
  makeSelectPostFormatData
};
