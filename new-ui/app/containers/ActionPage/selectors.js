import { createSelector } from 'reselect';

/**
 * Direct selector to the ActionPage state domain
 */
const selectActionPageDomain = state => state.action;

/**
 * Other specific selectors
 */
const makeSelectAction = () => createSelector(
  selectActionPageDomain,
  (actionPageState) => actionPageState.action
);

const makeSelectActionWebhook = () => createSelector(
  selectActionPageDomain,
  (actionPageState) => actionPageState.webhook
);

const makeSelectActionPostFormat = () => createSelector(
  selectActionPageDomain,
  (actionPageState) => actionPageState.postFormat
);


export {
  makeSelectAction,
  makeSelectActionWebhook,
  makeSelectActionPostFormat
};
