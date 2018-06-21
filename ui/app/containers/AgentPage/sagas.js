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
import {
  makeSelectAgentData,
  makeSelectOldWebhookData,
  makeSelectOldAgentData,
  makeSelectPostFormatData,
  makeSelectWebhookData,
  makeSelectAgentSettingsData,
} from '../AgentPage/selectors';
import {
  agentCreated,
  agentCreationError,
  webhookCreationError,
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
  loadWebhook,
  loadWebhookError,
  loadWebhookSuccess,
  loadPostFormat,
  loadPostFormatError,
  loadPostFormatSuccess,
  loadAgentSettings,
  loadAgentSettingsError,
  loadAgentSettingsSuccess,
} from './actions';
import {
  LOAD_AGENT,
  LOAD_WEBHOOK,
  LOAD_POSTFORMAT,
  LOAD_AGENT_SETTINGS
} from './constants';

function* putAgentSettings(payload) {
  const { api, id } = payload;
  const agentSettingsData = yield select(makeSelectAgentSettingsData());
  try {
    yield call(api.agent.putAgentIdSettings, { id, body: agentSettingsData });
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(updateAgentSettingsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(updateAgentSettingsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateAgentSettingsError({ message: 'Unknow API error' }));
      }
    }
  }
}

function* postWebhook(payload) {
  const { api, id } = payload;
  const webhookData = yield select(makeSelectWebhookData());

  try {
    yield call(api.agent.postAgentIdWebhook, { id, body: webhookData });
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(webhookCreationError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(webhookCreationError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(webhookCreationError({ message: 'Unknow API error' }));
      }
    }
  }
}

function* postPostFormat(payload) {
  const { api, id } = payload;
  const postFormatData = yield select(makeSelectPostFormatData());

  try {
    yield call(api.agent.postAgentIdPostformat, { id, body: postFormatData });
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(webhookCreationError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(webhookCreationError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(webhookCreationError({ message: 'Unknow API error' }));
      }
    }
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
    if (agent.useWebhook) {
      yield call(postWebhook, { api, id: agent.id });
    }
    if (agent.usePostFormat) {
      yield call(postPostFormat, { api, id: agent.id });
    }
    yield call(putAgentSettings, { api, id: agent.id });
    yield put(agentCreated(agent));
    yield call(getAgents, { api });
    //yield put(loadCurrentAgent(agent.id));
    if (inWizard) {
      yield put(push('/wizard/domain'));
    }
    else {
      yield put(push('/domains'));
    }
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(agentCreationError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(agentCreationError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(agentCreationError({ message: 'Unknow API error' }));
      }
    }
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
  const { agent, ...data } = webhookData;
  delete data.id;
  try {
    if (!_.isEqual(webhookData, oldWebhookData)) {
      yield call(api.agent.putAgentIdWebhook, { id, body: data });
    }
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(updateWebhookError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(updateWebhookError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateWebhookError({ message: 'Unknow API error' }));
      }
    }
  }
}

function* putPostFormat(payload) {
  const { api, id } = payload;
  const postFormatData = yield select(makeSelectPostFormatData());
  const { agent, ...data } = postFormatData;
  delete data.id;
  try {
    yield call(api.agent.putAgentIdPostformat, { id, body: data });

  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(updateWebhookError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(updateWebhookError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateWebhookError({ message: 'Unknow API error' }));
      }
    }
  }
}

function* deleteWebhook(payload) {
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentIdWebhook, { id });
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(updateWebhookError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(updateWebhookError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateWebhookError({ message: 'Unknow API error' }));
      }
    }
  }
}

function* deletePostFormat(payload) {
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentIdPostformat, { id });
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(updateWebhookError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(updateWebhookError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateWebhookError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* putAgent(payload) {
  const { api } = payload;
  const agentData = yield select(makeSelectAgentData());
  const oldAgentData = yield select(makeSelectOldAgentData());
  const updatedData = agentData.updateIn(['domainClassifierThreshold'], domainClassifierThreshold => domainClassifierThreshold / 100);
  const { id, ...data } = updatedData;
  try {
    if (!_.isEqual(agentData, oldAgentData)) {
      yield call(api.agent.putAgentId, { id, body: data });
    }
    if (oldAgentData.useWebhook) {
      if (agentData.useWebhook) {
        yield call(putWebhook, { api, id: agentData.id });
      }
      else {
        yield call(deleteWebhook, { api, id: agentData.id });
      }
    }
    else {
      if (agentData.useWebhook) {
        yield call(postWebhook, { api, id: agentData.id });
      }
    }
    if (oldAgentData.usePostFormat) {
      if (agentData.usePostFormat) {
        yield call(putPostFormat, { api, id: agentData.id });
      }
      else {
        yield call(deletePostFormat, { api, id: agentData.id });
      }
    }
    else {
      if (agentData.usePostFormat) {
        yield call(postPostFormat, { api, id: agentData.id });
      }
    }
    yield call(putAgentSettings, { api, id: agentData.id });
    yield put(updateAgentSuccess());
    yield call(getAgents, { api });
    yield put(loadCurrentAgent(agentData.id));
    yield put(push('/domains'));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(updateAgentError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(updateAgentError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateAgentError({ message: 'Unknow API error' }));
      }
    }
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
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(loadWebhookError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(loadWebhookError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadWebhookError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* getAgentSettings(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentIdSettings, { id });
    const agentSettings = response.obj;
    yield put(loadAgentSettingsSuccess(agentSettings));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(loadAgentSettingsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(loadAgentSettingsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadAgentSettingsError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* getPostFormat(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentIdPostformat, { id });

    const postFormat = response.obj;
    yield put(loadPostFormatSuccess(postFormat));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(loadPostFormatError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(loadPostFormatError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadPostFormatError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* getAgent(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentId, { id });
    const agent = response.obj;
    agent.domainClassifierThreshold *= 100;
    yield put(loadAgentSuccess(agent));
    yield put(loadWebhook(id));
    yield put(loadPostFormat(id));
    yield put(loadAgentSettings(id));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(loadAgentError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(loadAgentError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadAgentError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* loadAgent() {
  const watcher = yield takeLatest(LOAD_AGENT, getAgent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadWebhookSaga() {
  const watcher = yield takeLatest(LOAD_WEBHOOK, getWebhook);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadPostFormatSaga() {
  const watcher = yield takeLatest(LOAD_POSTFORMAT, getPostFormat);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgentSettingsSaga() {
  const watcher = yield takeLatest(LOAD_AGENT_SETTINGS, getAgentSettings);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  loadAgent,
  createAgent,
  updateAgent,
  loadWebhookSaga,
  loadPostFormatSaga,
  loadAgentSettingsSaga
];
