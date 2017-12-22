import { LOCATION_CHANGE } from 'react-router-redux';

import {
  call,
  cancel,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  agentLoaded,
  agentLoadingError,
  agentsLoaded,
  agentsLoadingError,
  loadCurrentAgentSuccess,
  loadCurrentAgentError,
} from '../../containers/App/actions';
import {
  LOAD_AGENT,
  LOAD_AGENTS,
  LOAD_CURRENT_AGENT,
} from '../../containers/App/constants';

import request from '../../utils/request';

export function* getAgents() {
  const requestURL = 'http://127.0.0.1:8000/agent';

  try {
    const agents = yield call(request, requestURL);
    yield put(agentsLoaded(agents));
  } catch (error) {
    yield put(agentsLoadingError({
      message: 'An error occurred loading the list of available agents',
      error,
    }));
  }
}

export function* loadAgents() {
  const watcher = yield takeLatest(LOAD_AGENTS, getAgents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgent(payload) {
  const requestURL = `http://127.0.0.1:8000/agent/${payload.id}`;

  try {
    const agent = yield call(request, requestURL);
    yield put(agentLoaded(agent));
  } catch (error) {
    yield put(agentLoadingError({
      message: 'An error occurred loading the agent',
      error,
    }));
  }
}

export function* loadAgent() {
  const watcher = yield takeLatest(LOAD_AGENT, getAgent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getCurrentAgent(payload) {
  const requestURL = `http://127.0.0.1:8000/agent/${payload.id}`;

  try {
    const agent = yield call(request, requestURL);
    yield put(loadCurrentAgentSuccess(agent));
  } catch (error) {
    yield put(loadCurrentAgentError({
      message: 'An error occurred loading the agent',
      error,
    }));
  }
}

export function* loadCurrentAgent() {
  const watcher = yield takeLatest(LOAD_CURRENT_AGENT, getCurrentAgent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadAgents,
  loadAgent,
  loadCurrentAgent,
];
