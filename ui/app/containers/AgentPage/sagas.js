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
  selectCurrentAgent,
  updateAgentError,
  updateAgentSuccess
} from '../App/actions';

import {
  CREATE_AGENT,
  UPDATE_AGENT
} from '../App/constants';
import { getAgents } from '../App/sagas';
import { makeSelectInWizard } from '../App/selectors';
import {
  loadAgentError,
  loadAgentSuccess
} from './actions';
import { LOAD_AGENT } from './constants';

export function* postAgent(payload) {
  const { api } = payload;
  const agentData = yield select(makeSelectAgentData());
  const inWizard = yield select(makeSelectInWizard());
  agentData.domainClassifierThreshold /= 100;
  try {
    const response = yield call(api.agent.postAgent, { body: agentData });
    const agent = response.obj;
    yield put(agentCreated(agent));
    yield call(getAgents, { api });
    yield put(selectCurrentAgent(agent));
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

export function* putAgent(payload) {
  const { api } = payload;
  const agentData = yield select(makeSelectAgentData());
  const { id, ...data } = agentData;
  data.domainClassifierThreshold /= 100;

  try {
    const response = yield call(api.agent.putAgentId, { id, body: data });
    const agent = response.obj;
    yield put(updateAgentSuccess(agent));
    yield call(getAgents, { api });
    yield put(selectCurrentAgent(agent));
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

// Bootstrap sagas
export default [
  createAgent,
  loadAgent,
  updateAgent,
];
