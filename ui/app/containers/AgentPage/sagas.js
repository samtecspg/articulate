import {
  LOCATION_CHANGE,
  push
} from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import { makeSelectAgentData } from '../AgentPage/selectors';
import {
  agentCreated,
  agentCreationError,
  webhookCreationError,
  //selectCurrentAgent,
  updateAgentError,
  updateAgentSuccess,
  updateWebhookError,
  loadCurrentAgent,
} from '../App/actions';

import {
  CREATE_AGENT,
  UPDATE_AGENT
} from '../App/constants';
import { getAgents } from '../App/sagas';
import { makeSelectInWizard } from '../App/selectors';
import {
  loadAgentError,
  loadAgentSuccess,
  loadWebhookError,
  loadWebhookSuccess,
} from './actions';
import { LOAD_AGENT, LOAD_WEBHOOK } from './constants';
import { makeSelectWebhookData } from './selectors';

function* postWebhook(payload) {
  const { api, id } = payload;
  const webhookData = yield select(makeSelectWebhookData());

  try {
    yield call(api.agent.postAgentIdWebhook, { id, body: webhookData });
  } catch ({ response }) {
    yield put(webhookCreationError({ message: response.obj.message }));
    throw response;
  }
}

export function* postAgent(payload) {
  const { api } = payload;
  const data = yield select(makeSelectAgentData());
  const inWizard = yield select(makeSelectInWizard());
  const updatedData = data.updateIn(['domainClassifierThreshold'], domainClassifierThreshold => domainClassifierThreshold / 100);
  try {
    const response = yield call(api.agent.postAgent, { body: updatedData });
    const agent = response.obj;
    if (agent.useWebhook){
      yield call(postWebhook, { api, id: agent.id });
    }
    yield put(agentCreated(agent));
    yield call(getAgents, { api });
    //yield put(loadCurrentAgent(agent.id));
    if (inWizard) {
      yield put(push('/wizard/domain'));
    }
    else {
      yield put(push('/domains'));
    }
  } catch ({ response }) {
    yield put(agentCreationError({ message: response.obj.message }));
  }
}

export function* createAgent() {
  const watcher = yield takeLatest(CREATE_AGENT, postAgent);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* putWebhook(payload) {
  const { api, id } = payload;
  const webhookData = yield select(makeSelectWebhookData());
  delete webhookData.id;
  delete webhookData.agent;
  try {
    const response = yield call(api.agent.putAgentIdWebhook, { id, body: webhookData });
    const webhook = response.obj;
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

export function* putAgent(payload) {
  const { api } = payload;
  const agentData = yield select(makeSelectAgentData());
  const updatedData = agentData.updateIn(['domainClassifierThreshold'], domainClassifierThreshold => domainClassifierThreshold / 100);

  const { id, ...data } = updatedData;

  try {
    const response = yield call(api.agent.putAgentId, { id, body: data });
    const agent = response.obj;
    if (agent.useWebhook){
      yield call(putWebhook, { api, id: agent.id });
    }
    yield put(updateAgentSuccess(agent));
    yield call(getAgents, { api });
    yield put(loadCurrentAgent(agent.id));
    yield put(push('/domains'));
  } catch ({ response }) {
    yield put(updateAgentError({ message: response.obj.message }));
  }
}

export function* updateAgent() {
  const watcher = yield takeLatest(UPDATE_AGENT, putAgent);
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

// Bootstrap sagas
export default [
  createAgent,
  loadAgent,
  loadWebhook,
  updateAgent,
];
