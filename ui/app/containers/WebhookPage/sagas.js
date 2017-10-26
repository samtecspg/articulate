import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { CREATE_WEBHOOK, LOAD_AGENTS } from 'containers/App/constants';
import { webhookCreated, webhookCreationError, agentsLoaded, agentsLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectWebhookData } from 'containers/WebhookPage/selectors';

export function* postWebhook() {
  const webhookData = yield select(makeSelectWebhookData());

  const requestURL = `http://127.0.0.1:8000/agent/${webhookData.agent}`;
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      webhookUrl: webhookData.webhookUrl,
      webhookFallbackUrl: webhookData.webhookUrl,
    }),
  }

  try {
    const webhook = yield call(request, requestURL, requestOptions);
    yield put(webhookCreated(webhook, webhook._id));
  } catch (error) {
    yield put(webhookCreationError({
      message: 'An error ocurred creating the webhook',
      error,
    }));
  }
}

export function* createWebhook() {
  const watcher = yield takeLatest(CREATE_WEBHOOK, postWebhook);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgents() {
  const requestURL = `http://127.0.0.1:8000/agent?size=999`;

  try {
    const agents = yield call(request, requestURL);
    yield put(agentsLoaded(agents));
  } catch (error) {
    yield put(agentsLoadingError({
      message: 'An error ocurred loading the list of available agents',
      error
    }));
  }
}

export function* loadAgents() {
  const watcher = yield takeLatest(LOAD_AGENTS, getAgents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


// Bootstrap sagas
export default [
  createWebhook,
  loadAgents
];
