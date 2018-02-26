import {
  LOCATION_CHANGE,
  push,
} from 'react-router-redux';

import {
  call,
  cancel,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  deleteAgentError,
  deleteAgentSuccess,
  resetCurrentAgent,
} from '../../containers/App/actions';
import { DELETE_AGENT } from '../../containers/App/constants';
import { getAgents } from '../../containers/App/sagas';
import {
  loadAgentError,
  loadAgentSuccess,
  loadWebhookError,
  loadWebhookSuccess,
} from './actions';
import { LOAD_AGENT, LOAD_WEBHOOK } from './constants';

export function* deleteAgent() {
  const action = function* (payload) {
    const { api, id } = payload;
    try {
      yield call(api.agent.deleteAgentId, { id });
      yield put(deleteAgentSuccess());
      yield call(getAgents, { api });
      yield put(resetCurrentAgent());
      yield put(push('/'));
    } catch (error) {
      yield put(deleteAgentError({
        message: `An error occurred deleting the agent [${payload.id}]`,
        error,
      }));
    }
  };
  const watcher = yield takeLatest(DELETE_AGENT, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getWebhook(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentIdWebhook, { id });
    const webhook = response.obj;
    yield put(loadWebhookSuccess(webhook));
  } catch ({ response }) {
    yield put(loadWebhookError({ message: response.obj.message }));
  }
}

export function* getAgent(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentId, { id });
    const agent = response.obj;
    agent.domainClassifierThreshold *= 100;
    yield put(loadAgentSuccess(agent));
  } catch ({ response }) {
    yield put(loadAgentError({ message: response.obj.message }));
  }
}

export function* loadAgent() {
  const watcher = yield takeLatest(LOAD_AGENT, getAgent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadWebhook() {
  const watcher = yield takeLatest(LOAD_WEBHOOK, getWebhook);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


// All sagas to be loaded
export default [
  deleteAgent,
  loadAgent,
  loadWebhook,
];
