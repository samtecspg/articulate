import { createSelector } from 'reselect';

const selectWebhook = (state) => state.get('webhook');

const makeSelectWebhookData = () => createSelector(
  selectWebhook,
  (webhookState) => webhookState.get('webhookData').toJS(),
);

export {
  selectWebhook,
  makeSelectWebhookData,
};
