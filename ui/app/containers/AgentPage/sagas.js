import _ from 'lodash';

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
import { makeSelectAgentData, makeSelectOldWebhookData, makeSelectOldAgentData } from '../AgentPage/selectors';
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
  const oldWebhookData = yield select(makeSelectOldWebhookData());
  const {agent, ...data} = webhookData;
  delete data.id;
  try {
    if (!_.isEqual(webhookData, oldWebhookData)){
      yield call(api.agent.putAgentIdWebhook, { id, body: data });
    }
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

function* deleteWebhook(payload) {
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentIdWebhook, { id });
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

export function* putAgent(payload) {
  const { api } = payload;
  const agentData = yield select(makeSelectAgentData());
  const oldAgentData = yield select(makeSelectOldAgentData());
  const updatedData = agentData.updateIn(['domainClassifierThreshold'], domainClassifierThreshold => domainClassifierThreshold / 100);
  const { id, ...data } = updatedData;
  try {
    if (!_.isEqual(agentData, oldAgentData)){
      yield call(api.agent.putAgentId, { id, body: data });
    }
    if (oldAgentData.useWebhook){
      if (agentData.useWebhook){
        yield call(putWebhook, { api, id: agentData.id });
      }
      else {
        yield call(deleteWebhook, {api, id: agentData.id});
      }
    }
    else {
      if (agentData.useWebhook){
        yield call(postWebhook, { api, id: agentData.id });
      }
    }
    yield put(updateAgentSuccess());
    yield call(getAgents, { api });
    yield put(loadCurrentAgent(agentData.id));
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
