import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  webhookCreated,
  webhookCreationError,
} from '../../containers/App/actions';
import { CREATE_WEBHOOK, } from '../../containers/App/constants';
import { makeSelectWebhookData } from '../../containers/WebhookPage/selectors';

export function* postWebhook(payload) {
  const { api } = payload;
  const webhookData = yield select(makeSelectWebhookData());
  const body = {
    webhookUrl: webhookData.webhookUrl
  };
  try {
    const response = yield call(api.agent.putAgentId, { id: webhookData.agent, body });
    const webhook = response.obj;
    yield put(webhookCreated(webhook, webhook.id));
  } catch ({ response }) {
    yield put(webhookCreationError({ message: response.obj.message }));
  }
}

export function* createWebhook() {
  const watcher = yield takeLatest(CREATE_WEBHOOK, postWebhook);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  createWebhook,
];
